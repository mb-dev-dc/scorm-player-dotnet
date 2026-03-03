using ScormHostWeb.Models;

namespace ScormHost.Web.Services
{
    /// <summary>
    /// Interface for storage operations to support multiple storage implementations (local disk, Azure Blob Storage, etc.)
    /// </summary>
    public interface IStorageService
    {
        /// <summary>
        /// Uploads and extracts a SCORM package to storage
        /// </summary>
        /// <param name="scormPackage">The uploaded SCORM package file</param>
        /// <param name="courseId">Unique identifier for the course</param>
        /// <returns>Service result containing the package path on success</returns>
        Task<ServiceResult<string>> UploadAndExtractPackageAsync(IFormFile scormPackage, Guid courseId);

        /// <summary>
        /// Deletes a SCORM package from storage
        /// </summary>
        /// <param name="packagePath">The path to the package to delete</param>
        Task DeletePackageAsync(string packagePath);

        /// <summary>
        /// Checks if a manifest file exists in the extracted package
        /// </summary>
        /// <param name="packagePath">The path to the package</param>
        /// <returns>True if manifest exists, false otherwise</returns>
        Task<bool> ManifestExistsAsync(string packagePath);

        /// <summary>
        /// Opens a file from the extracted package as a stream
        /// </summary>
        /// <param name="packagePath">The path to the package</param>
        /// <param name="fileName">Relative file name within the package</param>
        /// <returns>File stream, or null if not found</returns>
        Task<Stream?> ReadFileAsync(string packagePath, string fileName);
    }
}