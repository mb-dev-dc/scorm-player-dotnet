using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScormHost.Web.Data;
using ScormHostWeb.Models;
using System.IO.Compression;

namespace ScormHostWeb.Controllers
{
    public class CourseController : Controller
    {
        private readonly ScormDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public CourseController(ScormDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<IActionResult> Index()
        {
            var courses = await _context.Courses.ToListAsync();
            return View(courses);
        }

        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        [RequestSizeLimit(100 * 1024 * 1024)] // 100MB limit
        public async Task<IActionResult> Upload(IFormFile scormPackage, string title)
        {
            try
            {
                // Debug logging
                Console.WriteLine($"Upload method called");
                Console.WriteLine($"Title: '{title}'");
                Console.WriteLine($"File: {scormPackage?.FileName}");
                Console.WriteLine($"File Size: {scormPackage?.Length}");
                Console.WriteLine($"Content Type: {scormPackage?.ContentType}");

                if (!ModelState.IsValid)
                {
                    Console.WriteLine("ModelState is not valid:");
                    foreach (var kvp in ModelState)
                    {
                        Console.WriteLine($"Key: {kvp.Key}");
                        foreach (var error in kvp.Value.Errors)
                        {
                            Console.WriteLine($"  Error: {error.ErrorMessage}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in upload start: {ex.Message}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
                return BadRequest($"Error: {ex.Message}");
            }

            if (scormPackage == null || scormPackage.Length == 0)
            {
                ModelState.AddModelError("scormPackage", "Please select a SCORM package file.");
                Console.WriteLine("Error: No file selected");
                return View();
            }

            if (string.IsNullOrWhiteSpace(title))
            {
                ModelState.AddModelError("title", "Please enter a course title.");
                Console.WriteLine("Error: No title provided");
                return View();
            }

            if (!scormPackage.FileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
            {
                ModelState.AddModelError("scormPackage", "Only ZIP files are supported.");
                return View();
            }

            try
            {
                var courseId = Guid.NewGuid();
                var courseFolderPath = Path.Combine(_environment.WebRootPath, "scorm-packages", courseId.ToString());

                Directory.CreateDirectory(courseFolderPath);

                var zipFilePath = Path.Combine(courseFolderPath, scormPackage.FileName);
                using (var stream = new FileStream(zipFilePath, FileMode.Create))
                {
                    await scormPackage.CopyToAsync(stream);
                }

                ZipFile.ExtractToDirectory(zipFilePath, courseFolderPath);
                System.IO.File.Delete(zipFilePath);

                var manifestPath = Path.Combine(courseFolderPath, "imsmanifest.xml");
                if (!System.IO.File.Exists(manifestPath))
                {
                    Directory.Delete(courseFolderPath, true);
                    ModelState.AddModelError("scormPackage", "Invalid SCORM package. Missing imsmanifest.xml file.");
                    return View();
                }

                var course = new ScormCourse
                {
                    CourseId = courseId,
                    Title = title,
                    Version = "1.2",
                    PackagePath = Path.Combine("scorm-packages", courseId.ToString() + "/index_lms.html"),
                    LaunchScoId = "intro_sco_001", // todo: check if needed
                };

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                TempData["SuccessMessage"] = $"Course '{title}' uploaded successfully!";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"An error occurred while uploading the package: {ex.Message}");
                return View();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("Course/Delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            try
            {
                var courseFolderPath = Path.Combine(_environment.WebRootPath, course.PackagePath);
                if (Directory.Exists(courseFolderPath))
                {
                    Directory.Delete(courseFolderPath, true);
                }

                _context.Courses.Remove(course);
                await _context.SaveChangesAsync();

                TempData["SuccessMessage"] = $"Course '{course.Title}' deleted successfully!";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"An error occurred while deleting the course: {ex.Message}";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}