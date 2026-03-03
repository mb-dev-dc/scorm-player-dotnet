using ScormHostWeb.Models;
using System.IO.Compression;

namespace ScormHost.Web.Services
{
    /// <summary>
    /// Local disk storage implementation for SCORM packages
    /// </summary>
    public class LocalDiskStorageService : IStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<LocalDiskStorageService> _logger;

        public LocalDiskStorageService(IWebHostEnvironment environment, ILogger<LocalDiskStorageService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<ServiceResult<string>> UploadAndExtractPackageAsync(IFormFile scormPackage, Guid courseId)
        {
            try
            {
                var courseFolderPath = Path.Combine(_environment.WebRootPath, "scorm-packages", courseId.ToString());
                Directory.CreateDirectory(courseFolderPath);

                var zipFilePath = Path.Combine(courseFolderPath, scormPackage.FileName);
                using (var stream = new FileStream(zipFilePath, FileMode.Create))
                {
                    await scormPackage.CopyToAsync(stream);
                }

                ZipFile.ExtractToDirectory(zipFilePath, courseFolderPath);
                File.Delete(zipFilePath);

                var packagePath = Path.Combine("scorm-packages", courseId.ToString());
                return ServiceResult<string>.Success(packagePath, "Package uploaded and extracted successfully to local disk.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during local disk upload for course: {CourseId}", courseId);
                return ServiceResult<string>.Failure($"Failed to upload package to local disk: {ex.Message}");
            }
        }

        public Task DeletePackageAsync(string packagePath)
        {
            try
            {
                var fullPath = Path.Combine(_environment.WebRootPath, packagePath);
                if (Directory.Exists(fullPath))
                {
                    Directory.Delete(fullPath, true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during deletion of package at path: {PackagePath}", packagePath);
                throw;
            }

            return Task.CompletedTask;
        }

        public Task<bool> ManifestExistsAsync(string packagePath)
        {
            var manifestPath = Path.Combine(_environment.WebRootPath, packagePath, "imsmanifest.xml");
            return Task.FromResult(File.Exists(manifestPath));
        }

        public Task<Stream?> ReadFileAsync(string packagePath, string fileName)
        {
            var filePath = Path.Combine(_environment.WebRootPath, packagePath, fileName);
            if (!File.Exists(filePath))
                return Task.FromResult<Stream?>(null);
            return Task.FromResult<Stream?>(File.OpenRead(filePath));
        }
    }
}