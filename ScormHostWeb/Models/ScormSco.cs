namespace ScormHostWeb.Models
{
    public class ScormSco
    {
        public Guid ScoId { get; set; }
        public Guid CourseId { get; set; }
        public string Identifier { get; set; } // e.g., item identifier from manifest
        public string Title { get; set; }
        public string LaunchFile { get; set; } // e.g., "index.html"
        public ScormCourse Course { get; set; }
    }
}