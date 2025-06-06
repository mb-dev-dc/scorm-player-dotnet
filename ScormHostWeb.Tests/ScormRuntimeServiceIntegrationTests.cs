using System;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using ScormHost.Web.Services;
using ScormHost.Web.Data;
using ScormHost.Web.Data.Models;
using Microsoft.Extensions.Logging;
using Moq;

namespace ScormHostWeb.Tests
{
    public class ScormRuntimeServiceIntegrationTests
    {
        private ScormDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new ScormDbContext(options);
        }

        private ILogger<ScormRuntimeService> CreateLogger()
        {
            return new Mock<ILogger<ScormRuntimeService>>().Object;
        }

        [Fact]
        public async Task GetProgressAsync_ShouldReturnDefaultProgress_WhenNoAttemptsExist()
        {
            // Arrange
            using var dbContext = CreateInMemoryDbContext();
            var logger = CreateLogger();
            var service = new ScormRuntimeService(dbContext, logger);

            var userId = Guid.NewGuid();
            var courseId = Guid.NewGuid();

            dbContext.Courses.Add(new ScormCourse
            {
                CourseId = courseId,
                Title = "Test Course",
                LaunchScoId = "index.html",
                PackagePath = "path/to/package",
                Version = "1.2"
            });
            await dbContext.SaveChangesAsync();

            // Act
            var result = await service.GetProgressAsync(userId, courseId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("not_attempted", result.Status);
            Assert.Equal("not attempted", result.CompletionStatus);
        }

        [Fact]
        public async Task LaunchCourseAsync_ShouldCreateNewAttempt_WhenNoActiveAttemptExists()
        {
            // Arrange
            using var dbContext = CreateInMemoryDbContext();
            var logger = CreateLogger();
            var service = new ScormRuntimeService(dbContext, logger);

            var userId = Guid.NewGuid();
            var courseId = Guid.NewGuid();

            dbContext.Courses.Add(new ScormCourse
            {
                CourseId = courseId,
                Title = "Test Course",
                LaunchScoId = "index.html",
                PackagePath = "path/to/package",
                Version = "1.2"
            });
            dbContext.Users.Add(new ScormUser { Id = userId, Name = "Test User", Email = "test@example.com" });
            await dbContext.SaveChangesAsync();

            // Act
            var result = await service.LaunchCourseAsync(userId, courseId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(courseId, result.CourseId);
            Assert.Equal(userId, result.UserId);
            Assert.Contains("index.html", result.LaunchUrl);
        }
    }
}