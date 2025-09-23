namespace ScormHostWeb.Models
{
    public class LaunchViewModel
    {
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }
        public Guid? AttemptId { get; set; }
        public string LaunchUrl { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
        public object? ResumeData { get; set; }
        public bool IsResume { get; set; }
        public string CompletionStatus { get; set; } = "not attempted";
        public DateTime? LastAccessedOn { get; set; }
        public int AttemptNumber { get; set; } = 1;
        public decimal? ScoreRaw { get; set; }
    }
}