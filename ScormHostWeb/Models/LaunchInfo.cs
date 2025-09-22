namespace ScormHostWeb.Models
{
    public class LaunchInfo
    {
        public Guid AttemptId { get; set; }
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }
        public string LaunchUrl { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
        public object ResumeData { get; set; } = new();
    }
}