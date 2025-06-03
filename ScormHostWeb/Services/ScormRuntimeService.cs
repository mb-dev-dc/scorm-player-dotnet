using ScormHost.Web.Data;
using ScormHost.Web.Data.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Newtonsoft.Json.Linq;

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
            var courseExists = await _dbContext.Courses.AnyAsync(c => c.CourseId == courseId);
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
                AttemptId = attempt.AttemptId,
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

            // Get attempt number
            int attemptNumber = 1;
            if (attempt == null)
            {
                // Get the highest attempt number for this user and course
                var maxAttemptNumber = await _dbContext.Attempts
                    .Where(a => a.UserId == userId && a.CourseId == courseId)
                    .Select(a => a.AttemptNumber)
                    .DefaultIfEmpty(0)
                    .MaxAsync();
                attemptNumber = maxAttemptNumber + 1;

                // Create a new attempt
                attempt = new ScormAttempt
                {
                    AttemptId = Guid.NewGuid(),
                    CourseId = courseId,
                    UserId = userId,
                    AttemptNumber = attemptNumber,
                    LessonLocation = "",
                    SuspendData = "",
                    CompletionStatus = "not attempted",
                    SuccessStatus = "unknown",
                    ScoreRaw = null,
                    StartedOn = DateTime.UtcNow,
                    LastAccessedOn = DateTime.UtcNow,
                    CompletedOn = null,
                    TotalTime = TimeSpan.Zero
                };

                _dbContext.Attempts.Add(attempt);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // Update LastAccessedOn for the existing attempt
                attempt.LastAccessedOn = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
            }

            // Construct the launch URL
            string baseUrl = $"/scorm-packages/{courseId}/";
            string launchFile = course.LaunchScoId;
            if (string.IsNullOrEmpty(launchFile))
            {
                // Get the launch file from the default SCO if available
                var launchSco = await _dbContext.SCOs
                    .Where(s => s.CourseId == courseId)
                    .FirstOrDefaultAsync();
                
                launchFile = launchSco?.LaunchFile ?? "index_lms.html";
            }

            string launchUrl = baseUrl + launchFile;

            // Add query parameters
            launchUrl += $"?attemptId={attempt.AttemptId}&courseId={courseId}&userId={userId}";

            return new LaunchInfo
            {
                AttemptId = attempt.AttemptId,
                CourseId = courseId,
                UserId = userId,
                LaunchUrl = launchUrl,
                CourseTitle = course.Title
            };
        }

        /// <summary>
        /// Commits the current state of a SCORM attempt
        /// </summary>
        public async Task<bool> CommitAttemptAsync(Guid attemptId, JObject cmiData)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var attempt = await _dbContext.Attempts.FindAsync(attemptId);
                if (attempt == null)
                {
                    return false;
                }

                // Update the LastAccessedOn timestamp
                attempt.LastAccessedOn = DateTime.UtcNow;

                // Store the full CMI data as JSON
                attempt.AttemptStateJson = cmiData.ToString();

                // Update specific tracked fields from the CMI data
                UpdateAttemptFromCmiData(attempt, cmiData);

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private void UpdateAttemptFromCmiData(ScormAttempt attempt, JObject cmiData)
        {
            // Handle different SCORM versions
            bool isScorm2004 = attempt.Course?.Version == "2004";

            // Get the core data (structure differs between SCORM 1.2 and 2004)
            JObject coreData = isScorm2004 
                ? cmiData 
                : cmiData["core"] as JObject;

            if (coreData == null)
            {
                return;
            }

            // Update lesson_location (bookmark)
            string lessonLocation = isScorm2004
                ? coreData["location"]?.ToString()
                : coreData["lesson_location"]?.ToString();
            
            if (!string.IsNullOrEmpty(lessonLocation))
            {
                attempt.LessonLocation = lessonLocation;
            }

            // Update suspend_data
            string suspendData = isScorm2004
                ? cmiData["suspend_data"]?.ToString()
                : coreData["suspend_data"]?.ToString();

            if (!string.IsNullOrEmpty(suspendData))
            {
                attempt.SuspendData = suspendData;
            }

            // Update completion status
            if (isScorm2004)
            {
                // SCORM 2004 has separate completion_status and success_status
                string completionStatus = coreData["completion_status"]?.ToString();
                if (!string.IsNullOrEmpty(completionStatus))
                {
                    attempt.CompletionStatus = completionStatus;
                }

                string successStatus = coreData["success_status"]?.ToString();
                if (!string.IsNullOrEmpty(successStatus))
                {
                    attempt.SuccessStatus = successStatus;
                }
            }
            else
            {
                // SCORM 1.2 uses lesson_status for both completion and success
                string lessonStatus = coreData["lesson_status"]?.ToString();
                if (!string.IsNullOrEmpty(lessonStatus))
                {
                    // Map the lesson_status to both completion and success status
                    switch (lessonStatus.ToLower())
                    {
                        case "passed":
                            attempt.CompletionStatus = "completed";
                            attempt.SuccessStatus = "passed";
                            break;
                        case "failed":
                            attempt.CompletionStatus = "completed";
                            attempt.SuccessStatus = "failed";
                            break;
                        case "completed":
                            attempt.CompletionStatus = lessonStatus;
                            attempt.SuccessStatus = "unknown";
                            break;
                        default:
                            attempt.CompletionStatus = lessonStatus;
                            attempt.SuccessStatus = lessonStatus;
                            break;
                    }
                }
            }

            // Update score
            JObject scoreData = isScorm2004
                ? coreData["score"] as JObject
                : coreData["score"] as JObject;

            if (scoreData != null)
            {
                // Get raw score
                if (scoreData["raw"] != null)
                {
                    if (int.TryParse(scoreData["raw"].ToString(), out int rawScore))
                    {
                        attempt.ScoreRaw = rawScore;
                    }
                }

                // Get max score
                if (scoreData["max"] != null)
                {
                    if (int.TryParse(scoreData["max"].ToString(), out int maxScore))
                    {
                        attempt.ScoreMax = maxScore;
                    }
                }

                // Get min score
                if (scoreData["min"] != null)
                {
                    if (int.TryParse(scoreData["min"].ToString(), out int minScore))
                    {
                        attempt.ScoreMin = minScore;
                    }
                }

                // Get or calculate scaled score
                if (isScorm2004 && scoreData["scaled"] != null)
                {
                    if (double.TryParse(scoreData["scaled"].ToString(), out double scaledScore))
                    {
                        attempt.ScoreScaled = scaledScore;
                    }
                }
                else if (attempt.ScoreRaw.HasValue && attempt.ScoreMax.HasValue && attempt.ScoreMax.Value > 0)
                {
                    // Calculate scaled score from raw/max for SCORM 1.2
                    attempt.ScoreScaled = (double)attempt.ScoreRaw.Value / attempt.ScoreMax.Value;
                }
            }

            // Update session time and add to total time
            string sessionTime = isScorm2004
                ? coreData["session_time"]?.ToString()
                : coreData["session_time"]?.ToString();

            if (!string.IsNullOrEmpty(sessionTime))
            {
                TimeSpan sessionTimeSpan = ParseSCORMTimespan(sessionTime);
                attempt.TotalTime += sessionTimeSpan;
            }

            // Set CompletedOn if completion status indicates completion
            if (attempt.CompletionStatus == "completed" && !attempt.CompletedOn.HasValue)
            {
                attempt.CompletedOn = DateTime.UtcNow;
            }
        }

        private TimeSpan ParseSCORMTimespan(string timeString)
        {
            try
            {
                // SCORM 2004 format: P[yY][mM][dD][T[hH][mM][s[.s]S]]
                // SCORM 1.2 format: HHHH:MM:SS[.SS]
                if (timeString.StartsWith("P"))
                {
                    // SCORM 2004 format - this is a simplified version, you may need to enhance it
                    var time = new TimeSpan();
                    int tIndex = timeString.IndexOf('T');
                    if (tIndex >= 0)
                    {
                        string timeSection = timeString.Substring(tIndex + 1);
                        int hoursIndex = timeSection.IndexOf('H');
                        int minutesIndex = timeSection.IndexOf('M');
                        int secondsIndex = timeSection.IndexOf('S');

                        if (hoursIndex > 0)
                        {
                            int.TryParse(timeSection.Substring(0, hoursIndex), out int hours);
                            time = time.Add(TimeSpan.FromHours(hours));
                        }
                        if (minutesIndex > 0 && (hoursIndex < 0 || minutesIndex > hoursIndex))
                        {
                            int startIndex = hoursIndex < 0 ? 0 : hoursIndex + 1;
                            int.TryParse(timeSection.Substring(startIndex, minutesIndex - startIndex), out int minutes);
                            time = time.Add(TimeSpan.FromMinutes(minutes));
                        }
                        if (secondsIndex > 0 && (minutesIndex < 0 || secondsIndex > minutesIndex))
                        {
                            int startIndex = minutesIndex < 0 ? (hoursIndex < 0 ? 0 : hoursIndex + 1) : minutesIndex + 1;
                            double.TryParse(timeSection.Substring(startIndex, secondsIndex - startIndex), out double seconds);
                            time = time.Add(TimeSpan.FromSeconds(seconds));
                        }
                    }
                    return time;
                }
                else
                {
                    // SCORM 1.2 format
                    string[] parts = timeString.Split(':');
                    if (parts.Length == 3)
                    {
                        int.TryParse(parts[0], out int hours);
                        int.TryParse(parts[1], out int minutes);
                        double.TryParse(parts[2], out double seconds);
                        return new TimeSpan(hours, minutes, 0).Add(TimeSpan.FromSeconds(seconds));
                    }
                }
            }
            catch
            {
                // If parsing fails, return zero timespan
            }
            return TimeSpan.Zero;
        }
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
