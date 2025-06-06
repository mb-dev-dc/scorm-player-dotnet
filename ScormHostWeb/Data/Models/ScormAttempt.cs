using Microsoft.EntityFrameworkCore.Metadata.Internal;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ScormHost.Web.Data.Models
{
    public class ScormAttempt
    {
        public ScormAttempt()
        {
            // Initialize default values
            CompletionStatus = "not attempted";
            SuccessStatus = "unknown";
            TotalTime = TimeSpan.Zero;
        }

        public Guid AttemptId { get; set; }
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }
        public int AttemptNumber { get; set; }
        public DateTime StartedOn { get; set; }
        public DateTime? LastAccessedOn { get; set; }
        public DateTime? CompletedOn { get; set; }
        public string CompletionStatus { get; set; } // "not attempted", "incomplete", "completed"
        public string SuccessStatus { get; set; }  // "passed", "failed", "unknown" (for 2004)
        public double? ScoreScaled { get; set; }   // 0.0–1.0 normalized score 
        public decimal? ScoreRaw { get; set; }     // raw score (if provided)
        public decimal? ScoreMax { get; set; }
        public decimal? ScoreMin { get; set; }
        public string? LessonLocation { get; set; }   // bookmark (1.2)   
        public string? SuspendData { get; set; }      // potentially large text 
        public string? LaunchData { get; set; }       // data from LMS to SCO, rarely used
        public string? LessonMode { get; set; }       // "normal", "review", etc.
        public TimeSpan TotalTime { get; set; }      // aggregated time
        public string? AttemptStateJson { get; set; } // JSON dump of full cmi state
        
        // Navigation properties
        public ScormCourse Course { get; set; } = null!;
        public ScormUser User { get; set; } = null!;
    }
}
