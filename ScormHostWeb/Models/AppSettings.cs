namespace ScormHostWeb.Models
{
    public class AppSettings
    {   
        public DatabaseSettings Database { get; set; } = new();
        public JwtSettings Jwt { get; set; } = new();
        public bool IsTestMode { get; set; }
        public TestDataSettings TestData { get; set; } = new();
        public string AllowedHosts { get; set; } = "*";
    }

    public class DatabaseSettings
    {
        public bool UseInMemory { get; set; }
        public string InMemoryDatabaseName { get; set; } = string.Empty;
    }

    public class JwtSettings
    {
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public string SigningKey { get; set; } = string.Empty;
        public int ExpiryInMinutes { get; set; }
    }

    public class TestDataSettings
    {
        public string UserId { get; set; } = string.Empty;
        public string CourseId { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
        public string CoursePath { get; set; } = string.Empty;
        public string CourseVersion { get; set; } = string.Empty;
    }
}