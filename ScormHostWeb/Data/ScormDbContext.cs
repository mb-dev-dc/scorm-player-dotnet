using Microsoft.EntityFrameworkCore;
using ScormHost.Web.Data.Models;

namespace ScormHost.Web.Data
{
    public class ScormDbContext : DbContext
    {
        public ScormDbContext(DbContextOptions<ScormDbContext> options) : base(options) { }
        
        public DbSet<ScormCourse> Courses { get; set; }
        public DbSet<ScormSco> SCOs { get; set; }
        public DbSet<ScormAttempt> Attempts { get; set; }
        public DbSet<ScormUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ScormCourse entity
            modelBuilder.Entity<ScormCourse>(entity =>
            {
                entity.HasKey(e => e.CourseId);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Version).IsRequired().HasMaxLength(10); // "1.2" or "2004"
                entity.Property(e => e.PackagePath).IsRequired().HasMaxLength(1024);
                entity.Property(e => e.LaunchScoId).HasMaxLength(255);
                
                // Configure one-to-many relationship with SCOs
                entity.HasMany(e => e.Scos)
                      .WithOne(e => e.Course)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Cascade);
                
                // Configure one-to-many relationship with Attempts
                entity.HasMany(e => e.Attempts)
                      .WithOne(e => e.Course)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ScormSco entity
            modelBuilder.Entity<ScormSco>(entity =>
            {
                entity.HasKey(e => e.ScoId);
                entity.Property(e => e.Identifier).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
                entity.Property(e => e.LaunchFile).IsRequired().HasMaxLength(1024);

                // Create index for faster lookups by CourseId
                entity.HasIndex(e => e.CourseId);
            });

            // Configure ScormAttempt entity
            modelBuilder.Entity<ScormAttempt>(entity =>
            {
                entity.HasKey(e => e.AttemptId);
                
                // Required fields
                entity.Property(e => e.StartedOn).IsRequired();
                entity.Property(e => e.CompletionStatus).HasMaxLength(50).HasDefaultValue("not attempted");
                entity.Property(e => e.SuccessStatus).HasMaxLength(50).HasDefaultValue("unknown");
                
                // Optional fields with appropriate sizes
                entity.Property(e => e.LessonLocation).HasMaxLength(1024);
                entity.Property(e => e.LessonMode).HasMaxLength(50);
                
                // Configure large text fields
                entity.Property(e => e.SuspendData).HasColumnType("nvarchar(max)");
                entity.Property(e => e.LaunchData).HasColumnType("nvarchar(max)");
                entity.Property(e => e.AttemptStateJson).HasColumnType("nvarchar(max)");
                
                // The relationships are defined in the Course and User entities
                
                // Create indexes for common queries
                entity.HasIndex(e => new { e.UserId, e.CourseId, e.CompletedOn });
                entity.HasIndex(e => new { e.UserId, e.CourseId, e.StartedOn });
            });

            // Configure ScormUser entity
            modelBuilder.Entity<ScormUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                
                // Create unique index on Email
                entity.HasIndex(e => e.Email).IsUnique();
                
                // Configure one-to-many relationship with Attempts
                entity.HasMany(e => e.Attempts)
                      .WithOne(e => e.User)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
