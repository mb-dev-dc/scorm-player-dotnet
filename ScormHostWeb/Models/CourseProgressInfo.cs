namespace ScormHostWeb.Models
{
    public class CourseProgressInfo
    {
        public Guid UserId { get; set; }
        public Guid CourseId { get; set; }
        public Guid? AttemptId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CompletionStatus { get; set; } = string.Empty;
        public decimal? Score { get; set; }
        public DateTime? StartedOn { get; set; }
        public DateTime? CompletedOn { get; set; }
        public string LessonLocation { get; set; } = string.Empty;
        public string SuspendData { get; set; } = string.Empty;
        public decimal ProgressPercentage { get; set; } = 0m;
        public int AttemptNumber { get; set; } = 1;
    }
}