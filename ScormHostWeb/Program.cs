using ScormHost.Web.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ScormHost.Web.Data;
using System.Text; // Added for Encoding
using ScormHostWeb.Models;

namespace ScormHostWeb;


public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add Services (Dependency Injection configuration)
        // Add MVC controllers with views (for UI pages)
        builder.Services.AddControllersWithViews();
        
        // Update the code to ensure Razor Runtime Compilation is properly configured
        builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();

        // Add Minimal APIs support (needs endpoints API explorer if using Swagger, etc.)
        builder.Services.AddEndpointsApiExplorer();
        
        // Configure database based on settings
        var useInMemory = builder.Configuration.GetValue<bool>("Database:UseInMemory", false);
        if (useInMemory)
        {
            var dbName = builder.Configuration.GetValue<string>("Database:InMemoryDatabaseName") ?? "ScormHostDb";
            builder.Services.AddDbContext<ScormDbContext>(options =>
                options.UseInMemoryDatabase(dbName));
        }
        else
        {
            builder.Services.AddDbContext<ScormDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("ScormDbConnection")));
        }

        // Configure JWT authentication with relaxed validation for development
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options => {
            // Very relaxed token validation for development
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = false,  // Don't validate signing key
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SigningKey"] ?? "DefaultDevKey_NotSecure")
                ),
                ValidateIssuer = false,            // Don't validate issuer
                ValidateAudience = false,          // Don't validate audience
                ValidateLifetime = false,          // Don't validate token expiration
                RequireExpirationTime = false      // Token doesn't need expiration time
            };

            // Optional: Allow JWT authentication to be bypassed during development
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context => 
                {
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    // For development, you might want to log but not fail:
                    Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                    return Task.CompletedTask;
                }
            };
        });

        // Configure authorization policies to be permissive in development
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AllowAnonymous", policy => policy.RequireAssertion(_ => true));
            // Default fallback policy that allows all requests (very permissive)
            options.DefaultPolicy = options.GetPolicy("AllowAnonymous");
            options.FallbackPolicy = options.DefaultPolicy;
        });
        
        // Configure authorization policies to be permissive for now
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("ApiAccess", policy =>
            {
                policy.RequireAssertion(_ => true); // Allow all requests for testing
            });
        });
        
        // Configure strongly typed settings
        builder.Services.Configure<AppSettings>(builder.Configuration);

        // Register application services (dependency injection for our custom services)
        builder.Services.AddScoped<ScormRuntimeService>(); // Handles SCORM runtime interactions
        builder.Services.AddScoped<ScormPackageService>(); // Handles course package management

        // Configure CORS to be very permissive for development
        builder.Services.AddCors(options => {
            options.AddPolicy("LMS-CORS", policy => {
                policy.AllowAnyOrigin()  // Allow requests from any origin
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        // Initialize database with seed data
        if (useInMemory)
        {
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ScormDbContext>();
                var appSettings = builder.Configuration.Get<AppSettings>();
                DatabaseSeeder.SeedAsync(context, appSettings);
            }
        }

        // Configure Middleware pipeline
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error"); // Friendly error page for UI in production
            app.UseHsts();
        }

        // Security-related middlewares
        app.UseHttpsRedirection();
        app.UseStaticFiles(); // Serve static files (CSS, JS, etc.)
        
        // Enable CORS with the relaxed policy
        app.UseCors("LMS-CORS");
        
        // REMOVE authentication and authorization middlewares for debugging
        // app.UseAuthentication();
        // app.UseAuthorization();
        
        // Map controller routes (for MVC UI and any attribute-routed Web API controllers if used)
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
        
        // Keep attribute routing
        app.MapControllers();

        // Define Minimal API endpoints for integration under /api (without authorization requirement)
        var apiGroup = app.MapGroup("/api"); // Removed RequireAuthorization()
        
        // Retrieve progress for given user & course
        apiGroup.MapGet("/progress/{userId:guid}/{courseId:guid}", async (
            Guid userId, Guid courseId, ScormRuntimeService runtime) =>
        {
            // Retrieve progress for given user & course (assuming one active attempt)
            var progress = await runtime.GetProgressAsync(userId, courseId);
            return progress is not null ? Results.Ok(progress) : Results.NotFound();
        });

        // Launch course endpoint
        apiGroup.MapPost("/launch", async (LaunchRequest request, ScormRuntimeService runtime) =>
        {
            // Create or resume a SCORM attempt for this user/course
            var launchInfo = await runtime.LaunchCourseAsync(request.UserId, request.CourseId);
            // launchInfo may contain an AttemptId and perhaps a one-time launch token or URL
            return Results.Ok(launchInfo);
        });

        // Add new Commit endpoint for SCORM data
        apiGroup.MapPost("/commit", async (CommitRequest request, ScormRuntimeService runtime) =>
        {
            // Commit the SCORM data to the database
            bool success = await runtime.CommitAttemptAsync(request.AttemptId, request.CmiData);
            return success ? Results.Ok() : Results.BadRequest("Failed to commit SCORM data");
        });

        app.Run();
    }
}
