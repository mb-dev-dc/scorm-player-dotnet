using Microsoft.AspNetCore.Mvc;
using ScormHost.Web.Services;
using System;
using System.Threading.Tasks;

namespace ScormHost.Web.Controllers
{
    // Removed [Authorize] to allow anonymous access during development
    public class ScormController : Controller
    {
        private readonly ScormRuntimeService _runtimeService;

        public ScormController(ScormRuntimeService runtimeService)
        {
            _runtimeService = runtimeService;
        }

        public async Task<IActionResult> Launch(Guid? courseId = null, Guid? userId = null)
        {
            if (!courseId.HasValue)
            {
                // Use a default course ID for development if not provided
                courseId = Guid.Parse("831663EE-325E-47E2-B7F9-4B23A8696798"); // Default course ID for development
            }

            // For development, always use a default user ID if not provided
            if (!userId.HasValue)
            {
                // Default development user ID
                userId = Guid.NewGuid(); // Using a new GUID as test user ID
                
                // If authentication is enabled, try to get from claims
                if (User.Identity?.IsAuthenticated == true)
                {
                    var userIdClaim = User.FindFirst("sub")?.Value;
                    if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
                    {
                        userId = parsedUserId;
                    }
                }
            }

            try
            {
                // Launch the course through the runtime service
                var launchInfo = await _runtimeService.LaunchCourseAsync(userId.Value, courseId.Value);
                if (launchInfo == null)
                {
                    // For development, create a minimal launchInfo object if the real one is null
                    ViewBag.CourseId = courseId.Value;
                    ViewBag.UserId = userId.Value;
                    ViewBag.LaunchUrl = $"/scorm-packages/{courseId.Value}/SHP/index_lms.html?userId={userId.Value}&courseId={courseId.Value}";
                    return View();
                }

                // Pass the launch information to the view
                ViewBag.CourseId = courseId.Value;
                ViewBag.UserId = userId.Value;
                ViewBag.LaunchUrl = launchInfo.LaunchUrl;

                return View();
            }
            catch (Exception ex)
            {
                // Log error but continue with default values for development
                Console.WriteLine($"Error in Launch: {ex.Message}");
                
                // Set fallback values for development
                ViewBag.CourseId = courseId.Value;
                ViewBag.UserId = userId.Value;
                ViewBag.LaunchUrl = $"/scorm-packages/{courseId.Value}/SHP/index_lms.html?userId={userId.Value}&courseId={courseId.Value}";
                
                return View();
            }
        }
    }
}
