namespace ScormHost.Web.Data.Models
{
    public class ScormAttempt
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }
        public string LessonLocation { get; set; }
        public string SuspendData { get; set; }
        public string CompletionStatus { get; set; }
        public int? ScoreRaw { get; set; }
        public DateTime StartedOn { get; set; }
        public DateTime? CompletedOn { get; set; }
    }
}
