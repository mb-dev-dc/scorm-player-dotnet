using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ScormHostWeb.Models;

namespace ScormHostWeb.Controllers
{
    public class HomeController (IOptions<AppSettings> appSettings) : Controller
    {
       
        public IActionResult Index()
        {
            var viewModel = new HomeIndexViewModel();

            if (appSettings.Value.IsTestMode)
            {
                viewModel.ShowLaunchCourse = true;
                viewModel.LaunchCourseUrl = "/scorm/launchTest";
                viewModel.LaunchCourseText = appSettings.Value.TestData.CourseTitle;
            }

            return View(viewModel);
        }
    }

    public class HomeIndexViewModel
    {
        public bool ShowLaunchCourse { get; set; }
        public string LaunchCourseUrl { get; set; } = string.Empty;
        public string LaunchCourseText { get; set; } = string.Empty;
    }
}
