using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ScormHostWeb.Models;
using System.IO.Compression;

namespace ScormHost.Web.Services
{
    /// <summary>
    /// Azure Blob Storage implementation for SCORM packages
    /// </summary>
    public class AzureStorageService : IStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private readonly ILogger<AzureStorageService> _logger;

        public AzureStorageService(IConfiguration configuration, ILogger<AzureStorageService> logger)
        {
            var connectionString = configuration["AzureStorage:ConnectionString"];
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Azure Storage connection string is not configured.");
            }

            _containerName = configuration["AzureStorage:ContainerName"] ?? "scorm-packages";
            _blobServiceClient = new BlobServiceClient(connectionString);
            _logger = logger;

            // Ensure container exists
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            containerClient.CreateIfNotExists(PublicAccessType.Blob);
        }

        public async Task<ServiceResult<string>> UploadAndExtractPackageAsync(IFormFile scormPackage, Guid courseId)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var courseFolder = courseId.ToString();

                // Create temporary directory for extraction
                var tempPath = Path.Combine(Path.GetTempPath(), courseFolder);
                Directory.CreateDirectory(tempPath);

                try
                {
                    // Save and extract zip to temp directory
                    var tempZipPath = Path.Combine(tempPath, scormPackage.FileName);
                    using (var stream = new FileStream(tempZipPath, FileMode.Create))
                    {
                        await scormPackage.CopyToAsync(stream);
                    }

                    ZipFile.ExtractToDirectory(tempZipPath, tempPath);
                    File.Delete(tempZipPath);

                    // Upload all extracted files to Azure Blob Storage
                    await UploadDirectoryToBlobAsync(containerClient, tempPath, courseFolder);

                    var packagePath = $"{_containerName}/{courseFolder}";
                    return ServiceResult<string>.Success(packagePath, "Package uploaded and extracted successfully to Azure Blob Storage.");
                }
                finally
                {
                    // Clean up temp directory
                    if (Directory.Exists(tempPath))
                    {
                        Directory.Delete(tempPath, true);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during Azure upload for course: {CourseId}", courseId);
                return ServiceResult<string>.Failure($"Failed to upload package to Azure: {ex.Message}");
            }
        }

        public async Task DeletePackageAsync(string packagePath)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

                // Extract course folder from package path (format: "container-name/course-id" or "course-id")
                var courseFolder = packagePath.Contains('/') ? packagePath.Split('/').Last() : packagePath;

                // List and delete all blobs with this prefix
                await foreach (var blobItem in containerClient.GetBlobsAsync(prefix: courseFolder))
                {
                    await containerClient.DeleteBlobIfExistsAsync(blobItem.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during deletion of package at path: {PackagePath}", packagePath);
                throw;
            }
        }

        public async Task<bool> ManifestExistsAsync(string packagePath)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

                // Extract course folder from package path
                var courseFolder = packagePath.Contains('/') ? packagePath.Split('/').Last() : packagePath;
                var manifestBlobName = $"{courseFolder}/imsmanifest.xml";

                var blobClient = containerClient.GetBlobClient(manifestBlobName);
                return await blobClient.ExistsAsync();
            }
            catch
            {
                return false;
            }
        }

        private async Task UploadDirectoryToBlobAsync(BlobContainerClient containerClient, string localPath, string blobPrefix)
        {
            var files = Directory.GetFiles(localPath, "*", SearchOption.AllDirectories);

            foreach (var filePath in files)
            {
                var relativePath = Path.GetRelativePath(localPath, filePath);
                var blobName = $"{blobPrefix}/{relativePath.Replace("\\", "/")}";

                var blobClient = containerClient.GetBlobClient(blobName);

                using var fileStream = File.OpenRead(filePath);
                await blobClient.UploadAsync(fileStream, overwrite: true);

                _logger.LogInformation("Uploaded {FileName} to {BlobName}", filePath, blobName);
            }
        }
    }
}