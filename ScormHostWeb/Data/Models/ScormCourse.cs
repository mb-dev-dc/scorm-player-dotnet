namespace ScormHost.Web.Data.Models
{
    public class ScormCourse
    {
        public ScormCourse()
        {
            Scos = new HashSet<ScormSco>();
            Attempts = new HashSet<ScormAttempt>();
        }

        public Guid CourseId { get; set; }
        public string Title { get; set; }
        public string Version { get; set; } // "1.2" or "2004"
        public string PackagePath { get; set; } // path to content package files
        public string LaunchScoId { get; set; } // default launch item
        
        // Navigation properties
        public ICollection<ScormSco> Scos { get; set; }
        public ICollection<ScormAttempt> Attempts { get; set; }
    }
}
