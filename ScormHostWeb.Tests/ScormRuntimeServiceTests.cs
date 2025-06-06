using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using ScormHost.Web.Services;
using ScormHost.Web.Data;
using ScormHost.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace ScormHostWeb.Tests
{
    public class ScormRuntimeServiceTests
    {
        private readonly ScormRuntimeService _service;
        private readonly Mock<ScormDbContext> _dbContextMock;
        private readonly Mock<ILogger<ScormRuntimeService>> _loggerMock;

        public ScormRuntimeServiceTests()
        {
            _dbContextMock = new Mock<ScormDbContext>(new DbContextOptions<ScormDbContext>());
            _loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            _service = new ScormRuntimeService(_dbContextMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task CommitAttemptAsync_ShouldReturnFalse_WhenAttemptNotFound()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object, isTestEnvironment: true);

            var attemptId = Guid.NewGuid();

            // Act
            var result = await service.CommitAttemptAsync(attemptId, new JObject());

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task FinishAttemptAsync_ShouldReturnFalse_WhenAttemptNotFound()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object);

            var attemptId = Guid.NewGuid();

            // Act
            var result = await service.FinishAttemptAsync(attemptId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task FinishAttemptAsync_ShouldMarkAttemptAsCompleted()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object, isTestEnvironment: true);

            var attemptId = Guid.NewGuid();
            var attempt = new ScormAttempt { AttemptId = attemptId, CompletedOn = null };
            dbContext.Attempts.Add(attempt);
            await dbContext.SaveChangesAsync();

            // Act
            var result = await service.FinishAttemptAsync(attemptId);

            // Assert
            Assert.True(result);
            Assert.NotNull(attempt.CompletedOn);
            Assert.Equal("completed", attempt.CompletionStatus);
        }

        [Fact]
        public async Task GetProgressAsync_ShouldReturnNull_WhenCourseDoesNotExist()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object, isTestEnvironment: true);

            var userId = Guid.NewGuid();
            var courseId = Guid.NewGuid();

            // Act
            var result = await service.GetProgressAsync(userId, courseId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetProgressAsync_ShouldReturnDefaultProgress_WhenNoAttemptsExist()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object, isTestEnvironment: true);

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
        public async Task LaunchCourseAsync_ShouldReturnNull_WhenCourseOrUserDoesNotExist()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object);

            var userId = Guid.NewGuid();
            var courseId = Guid.NewGuid();

            // Act
            var result = await service.LaunchCourseAsync(userId, courseId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task LaunchCourseAsync_ShouldCreateNewAttempt_WhenNoActiveAttemptExists()
        {
            // Arrange
            using var dbContext = new ScormDbContext(new DbContextOptionsBuilder<ScormDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options);
            var loggerMock = new Mock<ILogger<ScormRuntimeService>>();
            var service = new ScormRuntimeService(dbContext, loggerMock.Object, isTestEnvironment: true);

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