using Microsoft.EntityFrameworkCore;
using ScormHost.Web.Data;
using ScormHostWeb.Models;
using System;
using System.IO.Compression;

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

            var courseFolderPath = Path.Combine(path, course.PackagePath);
            if (Directory.Exists(courseFolderPath))
            {
                Directory.Delete(courseFolderPath, true);
            }

            _dbContext.Courses.Remove(course);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<string> Upload(IFormFile scormPackage, string title, string path)
        {
            var courseId = Guid.NewGuid();
            var courseFolderPath = Path.Combine(path, "scorm-packages", courseId.ToString());

            Directory.CreateDirectory(courseFolderPath);

            var zipFilePath = Path.Combine(courseFolderPath, scormPackage.FileName);
            using (var stream = new FileStream(zipFilePath, FileMode.Create))
            {
                await scormPackage.CopyToAsync(stream);
            }

            ZipFile.ExtractToDirectory(zipFilePath, courseFolderPath);
            File.Delete(zipFilePath);

            var manifestPath = Path.Combine(courseFolderPath, "imsmanifest.xml");
            if (!File.Exists(manifestPath))
            {
                return "Invalid SCORM package. Missing imsmanifest.xml file.";
            }

            var course = new ScormCourse
            {
                CourseId = courseId,
                Title = title,
                Version = "1.2",
                PackagePath = Path.Combine("scorm-packages", courseId.ToString() + "/index_lms.html"),
                LaunchScoId = "intro_sco_001", // todo: check if needed
            };

            await Add(course);
            return "success";
        }

        private async Task<ScormCourse> Add(ScormCourse course)
        {
            await _dbContext.Courses.AddAsync(course);
            await _dbContext.SaveChangesAsync();
            return course;
        }
    }
}
