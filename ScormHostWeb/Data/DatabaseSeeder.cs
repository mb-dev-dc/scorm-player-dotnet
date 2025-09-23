using ScormHostWeb.Models;
using Microsoft.EntityFrameworkCore;

namespace ScormHost.Web.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(ScormDbContext context, AppSettings appSettings)
        {
            // Ensure the database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            if (await context.Users.AnyAsync() || await context.Courses.AnyAsync())
            {
                return; // Database has been seeded
            }

            // Seed Users
            var users = new List<ScormUser>
            {
                new ScormUser
                {
                    Id = Guid.Parse(appSettings.TestData.UserId),
                    Name = "John Doe",
                    Email = "john.doe@example.com"
                }
            };

            await context.Users.AddRangeAsync(users);

            // Seed Courses
            var courses = new List<ScormCourse>
            {
                new ScormCourse
                {
                    CourseId = Guid.Parse(appSettings.TestData.CourseId),
                    Title = appSettings.TestData.CourseTitle,
                    Version = appSettings.TestData.CourseVersion,
                    PackagePath = appSettings.TestData.CoursePath,
                    LaunchScoId = "intro_sco_001", // todo: check if needed
                }
            };

            await context.Courses.AddRangeAsync(courses);

            // Seed SCOs (Shareable Content Objects)
            var scos = new List<ScormSco>
            {
                new ScormSco
                {
                    ScoId = Guid.Parse("1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a"),
                    CourseId = courses[0].CourseId,
                    Identifier = "intro_sco_001",
                    Title = "SCORM Overview",
                    LaunchFile = "content/lesson1/index.html"
                },
                new ScormSco
                {
                    ScoId = Guid.Parse("2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b"),
                    CourseId = courses[0].CourseId,
                    Identifier = "intro_sco_002",
                    Title = "SCORM Implementation",
                    LaunchFile = "content/lesson2/index.html"
                }
            };

            await context.SCOs.AddRangeAsync(scos);

            // Seed some sample attempts
            var attempts = new List<ScormAttempt>
            {
                new ScormAttempt
                {
                    AttemptId = Guid.Parse("a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1"),
                    UserId = users[0].Id,
                    CourseId = courses[0].CourseId,
                    StartedOn = DateTime.UtcNow.AddDays(-7),
                    CompletionStatus = "completed",
                    SuccessStatus = "passed",
                    ScoreRaw = 85,
                    ScoreMax = 100,
                    ScoreMin = 0,
                    LessonLocation = "lesson2",
                    LessonMode = "normal",
                    CompletedOn = DateTime.UtcNow.AddDays(-7).AddMinutes(45)
                },
            };

            await context.Attempts.AddRangeAsync(attempts);

            // Save all changes
            await context.SaveChangesAsync();
        }
    }
}