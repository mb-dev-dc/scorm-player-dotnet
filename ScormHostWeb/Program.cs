using ScormHost.Web.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ScormHost.Web.Data;

namespace ScormHostWeb;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllersWithViews();
        
        // Use SQL Server with the connection string from appsettings.json
        builder.Services.AddDbContext<ScormDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("ScormDbConnection")));

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    // Fill from config for production
                };
            });

        builder.Services.AddAuthorization();
        builder.Services.AddScoped<ScormRuntimeService>();
        builder.Services.AddScoped<ScormPackageService>();

        builder.Services.AddCors(options => {
            options.AddPolicy("LMS-CORS", p => {
                p.WithOrigins("https://yourlms.example.com").AllowAnyHeader().AllowAnyMethod();
            });
        });

        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseCors("LMS-CORS");
        app.UseAuthentication();
        app.UseAuthorization();
        
        // Add conventional routing
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
            
        // Keep attribute routing
        app.MapControllers();

        // Minimal API Example
        var api = app.MapGroup("/api").RequireAuthorization();
        api.MapGet("/progress/{userId}/{courseId}", async (
            Guid userId, Guid courseId, ScormDbContext db) =>
        {
            // return user progress (stub)
            return Results.Ok(new { userId, courseId, status = "incomplete" });
        });

        app.Run();

    }
}
