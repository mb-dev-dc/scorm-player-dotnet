using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ScormHost.Web.Services;
using ScormHostWeb.Models;

namespace ScormHostWeb.Controllers
{
    public class CourseController (ScormPackageService scormPackageService, IWebHostEnvironment environment, IOptions<AppSettings> appSettings) : Controller
    {
        public async Task<IActionResult> Index()
        {
            var courses = await scormPackageService.GetAll();
            ViewBag.UseLaunchTestUrl = appSettings.Value.IsTestMode && Helpers.DebugHelper.IsDebugMode;
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

            var uploadResult = await scormPackageService.Upload(scormPackage, title, environment.WebRootPath);

            if (!uploadResult.IsSuccess)
            {
                ModelState.AddModelError("scormPackage", uploadResult.Message);
                return View();
            }

            TempData["SuccessMessage"] = $"Course '{title}' uploaded successfully!";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("Course/Delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await scormPackageService.Delete(id, environment.WebRootPath);
                TempData["SuccessMessage"] = $"Course is deleted successfully!";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"An error occurred while deleting the course: {ex.Message}";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}