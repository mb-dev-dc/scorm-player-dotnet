namespace ScormHost.Web.Data.Models
{
    public class ScormCourse
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string ManifestPath { get; set; }
        public string Version { get; set; }
    }
}
