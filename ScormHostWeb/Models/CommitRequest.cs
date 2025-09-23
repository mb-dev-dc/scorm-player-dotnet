using Newtonsoft.Json.Linq;

namespace ScormHostWeb.Models
{
    // Add CommitRequest class for the commit API endpoint
    public class CommitRequest
    {
        public Guid AttemptId { get; set; }
        public JObject CmiData { get; set; }
    }
}
