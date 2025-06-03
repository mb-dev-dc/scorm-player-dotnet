using ScormHost.Web.Data;
using ScormHost.Web.Data.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ScormHost.Web.Services
{
    public class ScormRuntimeService
    {
        private readonly ScormDbContext _dbContext;

        public ScormRuntimeService(ScormDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Gets the progress information for a user's course attempt
        /// </summary>
        public async Task<CourseProgressInfo> GetProgressAsync(Guid userId, Guid courseId)
        {
            // Check if the course exists
            var courseExists = await _dbContext.Courses.AnyAsync(c => c.Id == courseId);
            if (!courseExists)
            {
                return null;
            }

            // Find the latest attempt for this user and course
            var attempt = await _dbContext.Attempts
                .Where(a => a.UserId == userId && a.CourseId == courseId)
                .OrderByDescending(a => a.StartedOn)
                .FirstOrDefaultAsync();

            if (attempt == null)
            {
                return new CourseProgressInfo
                {
                    UserId = userId,
                    CourseId = courseId,
                    Status = "not_attempted",
                    CompletionStatus = "not attempted",
                    Score = null,
                    StartedOn = null,
                    CompletedOn = null,
                    LessonLocation = "",
                    SuspendData = ""
                };
            }

            return new CourseProgressInfo
            {
                UserId = userId,
                CourseId = courseId,
                AttemptId = attempt.Id,
                Status = attempt.CompletedOn.HasValue ? "completed" : "incomplete",
                CompletionStatus = attempt.CompletionStatus,
                Score = attempt.ScoreRaw,
                StartedOn = attempt.StartedOn,
                CompletedOn = attempt.CompletedOn,
                LessonLocation = attempt.LessonLocation,
                SuspendData = attempt.SuspendData
            };
        }

        /// <summary>
        /// Launches or resumes a course for a user
        /// </summary>
        public async Task<LaunchInfo> LaunchCourseAsync(Guid userId, Guid courseId)
        {
            // Check that both user and course exist
            var course = await _dbContext.Courses.FindAsync(courseId);
            var user = await _dbContext.Users.FindAsync(userId);

            if (course == null || user == null)
            {
                return null;
            }

            // Find existing attempt or create a new one
            var attempt = await _dbContext.Attempts
                .Where(a => a.UserId == userId && a.CourseId == courseId && a.CompletedOn == null)
                .OrderByDescending(a => a.StartedOn)
                .FirstOrDefaultAsync();

            if (attempt == null)
            {
                // Create a new attempt
                attempt = new ScormAttempt
                {
                    Id = Guid.NewGuid(),
                    CourseId = courseId,
                    UserId = userId,
                    LessonLocation = "",
                    SuspendData = "",
                    CompletionStatus = "not attempted",
                    ScoreRaw = null,
                    StartedOn = DateTime.UtcNow,
                    CompletedOn = null
                };

                _dbContext.Attempts.Add(attempt);
                await _dbContext.SaveChangesAsync();
            }

            // Construct the launch URL
            string baseUrl = $"/scorm-packages/{courseId}/";
            string launchUrl = baseUrl + (string.IsNullOrEmpty(course.ManifestPath) ? "index_lms.html" : course.ManifestPath);

            // Add query parameters
            launchUrl += $"?attemptId={attempt.Id}&courseId={courseId}&userId={userId}";

            return new LaunchInfo
            {
                AttemptId = attempt.Id,
                CourseId = courseId,
                UserId = userId,
                LaunchUrl = launchUrl,
                CourseTitle = course.Title
            };
        }

        // Add other SCORM runtime methods as needed...
    }

    // DTOs for API responses
    public class CourseProgressInfo
    {
        public Guid UserId { get; set; }
        public Guid CourseId { get; set; }
        public Guid? AttemptId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CompletionStatus { get; set; } = string.Empty;
        public int? Score { get; set; }
        public DateTime? StartedOn { get; set; }
        public DateTime? CompletedOn { get; set; }
        public string LessonLocation { get; set; } = string.Empty;
        public string SuspendData { get; set; } = string.Empty;
    }

    public class LaunchInfo
    {
        public Guid AttemptId { get; set; }
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }
        public string LaunchUrl { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
    }
}
