using ScormHost.Web.Data;
using ScormHostWeb.Models;

namespace ScormHost.Web.Services
{
    /// <summary>
    /// // Handle SCORM package upload, extraction, and metadata
    /// </summary>
    public class ScormPackageService
    {
        private readonly ScormDbContext _dbContext;
        private readonly ILogger<ScormRuntimeService> _logger;

        public ScormPackageService (ScormDbContext scormDbContext, ILogger<ScormRuntimeService> logger)
        {
            _dbContext = scormDbContext;
            _logger = logger;
        }


        public async Task<ScormCourse>GetBydId(Guid courseId)
        {
            return await _dbContext.Courses.FindAsync(courseId);
        }   
    }
}
