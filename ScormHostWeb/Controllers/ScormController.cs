using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ScormHost.Web.Services;
using ScormHostWeb.Helpers;
using ScormHostWeb.Models;

namespace ScormHost.Web.Controllers
{
    // Removed [Authorize] to allow anonymous access during development
    public class ScormController (ScormRuntimeService runtimeService, IOptions<AppSettings> appSettings): Controller
    {
        public async Task<IActionResult> LaunchTest(Guid? courseId, bool forceNew = true)
        {
            if (!DebugHelper.IsDebugMode)
            {
                return NotFound();
            }

            Guid userId = Guid.Parse(appSettings.Value.TestData.UserId);
            var defaultCourseId = courseId.HasValue ? courseId : Guid.Parse(appSettings.Value.TestData.CourseId);

            var launchInfo = await runtimeService.LaunchCourseAsync(userId, defaultCourseId.Value, false);
            if (launchInfo == null)
            {
                var defaultViewModel = new LaunchViewModel
                {
                    CourseId = defaultCourseId.Value,
                    UserId = userId,
                    LaunchUrl = $"{appSettings.Value.TestData.CoursePath}?userId={userId}&courseId={courseId}"
                };

                return View("Launch", defaultViewModel);
            }

            var viewModel = BuildLaunchViewModel(launchInfo);
            viewModel.LaunchUrl = $"{appSettings.Value.TestData.CoursePath}?userId={userId}&courseId={courseId}";
            return View("Launch", viewModel);
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

            var launchInfo = await runtimeService.LaunchCourseAsync(userId, courseId.Value, forceNew);
            return View(BuildLaunchViewModel(launchInfo));
        }

        private LaunchViewModel BuildLaunchViewModel(LaunchInfo launchInfo) 
        {
            var resumeData = launchInfo.ResumeData as dynamic;

            return new LaunchViewModel
            {
                UserId = launchInfo.UserId,
                CourseId = launchInfo.CourseId,
                CourseTitle = launchInfo.CourseTitle,
                AttemptId = launchInfo.AttemptId,
                LaunchUrl = System.Web.HttpUtility.HtmlDecode(launchInfo.LaunchUrl),
                ResumeData = launchInfo.ResumeData as dynamic,
                IsResume = resumeData?.IsResume ?? false,
                CompletionStatus = resumeData?.CompletionStatus ?? "not attempted",
                LastAccessedOn = resumeData?.LastAccessedOn,
                AttemptNumber = resumeData?.AttemptNumber ?? 1,
                ScoreRaw = resumeData?.ScoreRaw
            };
        }
    }
}
