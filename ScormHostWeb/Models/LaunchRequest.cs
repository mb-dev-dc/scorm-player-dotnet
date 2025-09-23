namespace ScormHostWeb.Models
{
    // Add LaunchRequest class for the API endpoint
    public class LaunchRequest
    {
        public Guid UserId { get; set; }
        public Guid CourseId { get; set; }
    }
}
