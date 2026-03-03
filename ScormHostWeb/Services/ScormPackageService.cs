using Microsoft.EntityFrameworkCore;
using ScormHost.Web.Data;
using ScormHostWeb.Models;
using System.IO.Compression;
using System.Xml.Linq;

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

                // Parse manifest to find launch file and SCO identifier
                string launchFile = "index_lms.html";
                string launchScoId = "sco_1";
                string version = "1.2";

                var manifestStream = await _storageService.ReadFileAsync(packagePath, "imsmanifest.xml");
                if (manifestStream != null)
                {
                    using (manifestStream)
                    {
                        (launchFile, launchScoId, version) = ParseManifest(manifestStream);
                    }
                }

                var course = new ScormCourse
                {
                    CourseId = courseId,
                    Title = title,
                    Version = version,
                    PackagePath = packagePath, // storage path used for delete/manifest operations
                    LaunchScoId = launchScoId,
                };

                var addedCourse = await Add(course);

                await _dbContext.SCOs.AddAsync(new ScormSco
                {
                    ScoId = Guid.NewGuid(),
                    CourseId = courseId,
                    Identifier = launchScoId,
                    Title = title,
                    LaunchFile = launchFile,
                });
                await _dbContext.SaveChangesAsync();

                return ServiceResult<ScormCourse>.Success(addedCourse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during SCORM package upload for title: {Title}", title);
                return ServiceResult<ScormCourse>.Failure($"An error occurred while uploading the package: {ex.Message}");
            }
        }

        private static (string launchFile, string launchScoId, string version) ParseManifest(Stream manifestStream)
        {
            string launchFile = "index_lms.html";
            string launchScoId = "sco_1";
            string version = "1.2";

            try
            {
                var doc = XDocument.Load(manifestStream);

                var schemaVersion = doc.Descendants()
                    .FirstOrDefault(e => e.Name.LocalName == "schemaversion")?.Value ?? "";
                if (schemaVersion.Contains("2004") || schemaVersion == "CAM 1.3")
                    version = "2004";

                var resources = doc.Descendants()
                    .Where(e => e.Name.LocalName == "resource")
                    .ToList();

                // Prefer a resource explicitly marked as a SCO
                var scoResource = resources.FirstOrDefault(r =>
                    r.Attributes().Any(a => a.Name.LocalName == "scormtype" &&
                                           a.Value.Equals("sco", StringComparison.OrdinalIgnoreCase)));

                scoResource ??= resources.FirstOrDefault();

                if (scoResource != null)
                {
                    launchFile = scoResource.Attribute("href")?.Value ?? launchFile;
                    launchScoId = scoResource.Attribute("identifier")?.Value ?? launchScoId;
                }
            }
            catch
            {
                // Return defaults if parsing fails
            }

            return (launchFile, launchScoId, version);
        }

        private async Task<ScormCourse> Add(ScormCourse course)
        {
            await _dbContext.Courses.AddAsync(course);
            await _dbContext.SaveChangesAsync();
            return course;
        }
    }
}
