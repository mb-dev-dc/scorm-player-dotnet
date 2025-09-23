using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ScormHost.Web.Services;
using ScormHostWeb.Models;
using System.Diagnostics;

namespace ScormHost.Web.Controllers
{
    // Removed [Authorize] to allow anonymous access during development
    public class ScormController : Controller
    {
        private readonly ScormRuntimeService _runtimeService;
        private readonly ScormPackageService _scormPackageService;
        private readonly AppSettings _appSettings;

        public ScormController(ScormRuntimeService runtimeService, ScormPackageService scormPackageService,  IOptions<AppSettings> appSettings)
        {
            _runtimeService = runtimeService;
            _scormPackageService = scormPackageService;
            _appSettings = appSettings.Value;
        }

        
        public async Task<IActionResult> LaunchTest(bool forceNew = true)
        {
            Guid userId = Guid.Parse(_appSettings.TestData.UserId);
            Guid courseId = Guid.Parse(_appSettings.TestData.CourseId);

            var launchInfo = await _runtimeService.LaunchCourseAsync(userId, courseId, false);
            if(launchInfo == null)
            {
                ViewBag.CourseId = courseId;
                ViewBag.UserId = userId;
                ViewBag.LaunchUrl = $"{_appSettings.TestData.CoursePath}?userId={userId}&courseId={courseId}";
                return View("Launch");
            }

            // Pass the launch information to the view
            ViewBag.CourseId = courseId;
            ViewBag.UserId = userId;
            ViewBag.AttemptId = launchInfo.AttemptId;  // Explicitly pass the attemptId
            ViewBag.LaunchUrl = $"{_appSettings.TestData.CoursePath}?userId={userId}&courseId={courseId}";
            ViewBag.ResumeData = launchInfo.ResumeData; // Pass resume data to the view
            ViewBag.CourseTitle = launchInfo.CourseTitle;

            // Add resume status information for UI
            var resumeData = launchInfo.ResumeData as dynamic;
            ViewBag.IsResume = resumeData?.IsResume ?? false;
            ViewBag.CompletionStatus = resumeData?.CompletionStatus ?? "not attempted";
            ViewBag.LastAccessedOn = resumeData?.LastAccessedOn;
            ViewBag.AttemptNumber = resumeData?.AttemptNumber ?? 1;
            ViewBag.ScoreRaw = resumeData?.ScoreRaw;

            return View("Launch");

        }

        public async Task<IActionResult> Launch(Guid? courseId, bool forceNew = true)
        {
            if (!courseId.HasValue)
            {
                throw new ArgumentException("Course ID is required to launch a course.");
            }

            Guid userId = Guid.Empty;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.FindFirst("sub")?.Value;
                if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
                {
                    userId = parsedUserId;
                }
            }
            else
            {
                return RedirectToAction("Index", "Home"); // or redirect to sign in page
            }

            var launchInfo = await _runtimeService.LaunchCourseAsync(userId, courseId.Value, forceNew);

            // Pass the launch information to the view
            ViewBag.CourseId = courseId.Value;
            ViewBag.UserId = userId;
            ViewBag.AttemptId = launchInfo.AttemptId;  // Explicitly pass the attemptId
            ViewBag.LaunchUrl = System.Web.HttpUtility.HtmlDecode(launchInfo.LaunchUrl);
            ViewBag.ResumeData = launchInfo.ResumeData; // Pass resume data to the view
            ViewBag.CourseTitle = launchInfo.CourseTitle;

            // Add resume status information for UI
            var resumeData = launchInfo.ResumeData as dynamic;
            ViewBag.IsResume = resumeData?.IsResume ?? false;
            ViewBag.CompletionStatus = resumeData?.CompletionStatus ?? "not attempted";
            ViewBag.LastAccessedOn = resumeData?.LastAccessedOn;
            ViewBag.AttemptNumber = resumeData?.AttemptNumber ?? 1;
            ViewBag.ScoreRaw = resumeData?.ScoreRaw;

            // Log the LaunchUrl for debugging
            Console.WriteLine($"LaunchUrl: {ViewBag.LaunchUrl}");

            return View();

        }
    }
}
