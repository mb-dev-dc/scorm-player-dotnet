using Newtonsoft.Json.Linq;
using ScormHost.Web.Services;
using ScormHost.Web.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ScormHostWeb.Models;

namespace ScormHostWeb.Tests
{
    public class ScoreParsingTests
    {
        [Fact]
        public async Task CommitAttemptAsync_ShouldHandleDecimalScores_WhenPayloadContainsDecimalValues()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);

            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object, isTestEnvironment: true);

            var userId = Guid.NewGuid();
            var courseId = Guid.NewGuid();
            var attemptId = Guid.NewGuid();

            // Create test data
            dbContext.Courses.Add(new ScormCourse
            {
                CourseId = courseId,
                Title = "Test Course",
                LaunchScoId = "index.html",
                PackagePath = "path/to/package", 
                Version = "1.2"
            });

            dbContext.Users.Add(new ScormUser 
            { 
                Id = userId, 
                Name = "Test User", 
                Email = "test@example.com" 
            });

            dbContext.Attempts.Add(new ScormAttempt
            {
                AttemptId = attemptId,
                CourseId = courseId,
                UserId = userId,
                AttemptNumber = 1,
                StartedOn = DateTime.UtcNow
            });

            await dbContext.SaveChangesAsync();

            // Create the payload with decimal score as originally reported
            var payload = JObject.Parse(@"{
                ""core"": {
                    ""lesson_status"": ""incomplete"",
                    ""session_time"": ""00:00:00"",
                    ""exit"": ""suspend"",
                    ""score"": {
                        ""raw"": ""1.3333333"",
                        ""min"": ""0"",
                        ""max"": ""100""
                    }
                }
            }");

            // Act
            var result = await service.CommitAttemptAsync(attemptId, payload);

            // Assert
            Assert.True(result);

            // Verify the decimal score was parsed correctly
            var attempt = await dbContext.Attempts.FindAsync(attemptId);
            Assert.NotNull(attempt);
            Assert.Equal(1.3333333m, attempt.ScoreRaw);
            Assert.Equal(0m, attempt.ScoreMin);
            Assert.Equal(100m, attempt.ScoreMax);
        }
    }
}
