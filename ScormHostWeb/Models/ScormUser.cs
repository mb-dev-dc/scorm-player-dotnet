namespace ScormHostWeb.Models
{
    public class ScormUser
    {
        public ScormUser()
        {
            Attempts = new HashSet<ScormAttempt>();
        }

        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }

        // Navigation property
        public ICollection<ScormAttempt> Attempts { get; set; }
    }
}