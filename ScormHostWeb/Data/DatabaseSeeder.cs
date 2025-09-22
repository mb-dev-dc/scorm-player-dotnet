using ScormHostWeb.Models;
using Microsoft.EntityFrameworkCore;

namespace ScormHost.Web.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(ScormDbContext context)
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
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "John Doe",
                    Email = "john.doe@example.com"
                },
                new ScormUser
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Jane Smith",
                    Email = "jane.smith@example.com"
                },
                new ScormUser
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "Bob Johnson",
                    Email = "bob.johnson@example.com"
                },
                new ScormUser
                {
                    Id = Guid.Parse("C09FE532-00D4-4AF4-A50D-B5CE8A6F5894"),
                    Name = "Test User",
                    Email = "test.user@example.com"
                }
            };

            await context.Users.AddRangeAsync(users);

            // Seed Courses
            var courses = new List<ScormCourse>
            {
                new ScormCourse
                {
                    CourseId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Title = "Introduction to SCORM",
                    Version = "1.2",
                    PackagePath = "/courses/intro-scorm",
                    LaunchScoId = "intro_sco_001",
                },
                new ScormCourse
                {
                    CourseId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Title = "Advanced Web Development",
                    Version = "2004",
                    PackagePath = "/courses/advanced-web-dev",
                    LaunchScoId = "web_dev_sco_001",
                },
                new ScormCourse
                {
                    CourseId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Title = "Database Management Fundamentals",
                    Version = "1.2",
                    PackagePath = "/courses/database-fundamentals",
                    LaunchScoId = "db_sco_001",
                },
                new ScormCourse
                {
                    CourseId = Guid.Parse("3A4900BF-A18D-4372-9158-47710F5E1BDC"),
                    Title = "Development Test Course",
                    Version = "1.2",
                    PackagePath = "SHP",
                    LaunchScoId = "index_lms.html",
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
                },
                new ScormSco
                {
                    ScoId = Guid.Parse("3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c"),
                    CourseId = courses[1].CourseId,
                    Identifier = "web_dev_sco_001",
                    Title = "Modern Frameworks",
                    LaunchFile = "content/frameworks/index.html"
                },
                new ScormSco
                {
                    ScoId = Guid.Parse("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d"),
                    CourseId = courses[2].CourseId,
                    Identifier = "db_sco_001",
                    Title = "Database Design Principles",
                    LaunchFile = "content/db-design/index.html"
                },
                new ScormSco
                {
                    ScoId = Guid.Parse("5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e"),
                    CourseId = courses[3].CourseId,
                    Identifier = "index_lms.html",
                    Title = "Development Test Content",
                    LaunchFile = "index_lms.html"
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
                new ScormAttempt
                {
                    AttemptId = Guid.Parse("b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2"),
                    UserId = users[1].Id,
                    CourseId = courses[1].CourseId,
                    StartedOn = DateTime.UtcNow.AddDays(-3),
                    CompletionStatus = "incomplete",
                    SuccessStatus = "unknown",
                    ScoreRaw = 0,
                    ScoreMax = 100,
                    ScoreMin = 0,
                    LessonLocation = "intro",
                    LessonMode = "normal"
                },
                new ScormAttempt
                {
                    AttemptId = Guid.Parse("c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3"),
                    UserId = users[2].Id,
                    CourseId = courses[2].CourseId,
                    StartedOn = DateTime.UtcNow.AddDays(-1),
                    CompletionStatus = "completed",
                    SuccessStatus = "passed",
                    ScoreRaw = 92,
                    ScoreMax = 100,
                    ScoreMin = 0,
                    LessonLocation = "conclusion",
                    LessonMode = "normal",
                    CompletedOn = DateTime.UtcNow.AddDays(-1).AddMinutes(75)
                }
            };

            await context.Attempts.AddRangeAsync(attempts);

            // Save all changes
            await context.SaveChangesAsync();
        }
    }
}