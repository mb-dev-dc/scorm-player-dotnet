using Microsoft.EntityFrameworkCore;
using ScormHost.Web.Data;
using ScormHostWeb.Models;
using System.IO.Compression;

namespace ScormHost.Web.Services
{
    /// <summary>
    /// // Handle SCORM package upload, extraction, and metadata
    /// </summary>
    public class ScormPackageService
    {
        private readonly ScormDbContext _dbContext;
        private readonly ILogger<ScormPackageService> _logger;
        private readonly IStorageService _storageService;

        public ScormPackageService(ScormDbContext scormDbContext, ILogger<ScormPackageService> logger, IStorageService storageService)
        {
            _dbContext = scormDbContext;
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<ScormCourse>GetById(Guid courseId)
        {
            return await _dbContext.Courses.FindAsync(courseId);
        }

        public async Task<IEnumerable<ScormCourse>> GetAll()
        {
            return await _dbContext.Courses.ToListAsync();
        }

        public async Task Delete(Guid id, string path)
        {
            var course = await GetById(id);
            if(course == null)
            {
                ArgumentNullException.ThrowIfNull(course);
            }

            // Use storage service to delete the package
            await _storageService.DeletePackageAsync(course.PackagePath);

            _dbContext.Courses.Remove(course);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<ServiceResult<ScormCourse>> Upload(IFormFile scormPackage, string title, string path)
        {
            try
            {
                var courseId = Guid.NewGuid();

                // Use storage service to upload and extract package
                var uploadResult = await _storageService.UploadAndExtractPackageAsync(scormPackage, courseId);

                if (!uploadResult.IsSuccess)
                {
                    return ServiceResult<ScormCourse>.Failure(uploadResult.Message);
                }

                var packagePath = uploadResult.Data!;

                // Check if manifest exists
                var manifestExists = await _storageService.ManifestExistsAsync(packagePath);
                if (!manifestExists)
                {
                    // Clean up the package if manifest is missing
                    await _storageService.DeletePackageAsync(packagePath);
                    return ServiceResult<ScormCourse>.Failure("Invalid SCORM package. Missing imsmanifest.xml file.");
                }

                var course = new ScormCourse
                {
                    CourseId = courseId,
                    Title = title,
                    Version = "1.2",
                    PackagePath = packagePath + "/index_lms.html",
                    LaunchScoId = "intro_sco_001", // todo: check if needed
                };

                var addedCourse = await Add(course);
                return ServiceResult<ScormCourse>.Success(addedCourse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during SCORM package upload for title: {Title}", title);
                return ServiceResult<ScormCourse>.Failure($"An error occurred while uploading the package: {ex.Message}");
            }
        }

        private async Task<ScormCourse> Add(ScormCourse course)
        {
            await _dbContext.Courses.AddAsync(course);
            await _dbContext.SaveChangesAsync();
            return course;
        }
    }
}
