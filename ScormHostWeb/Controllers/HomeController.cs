using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ScormHost.Web.Data;
using ScormHostWeb.Models;

namespace ScormHostWeb.Controllers
{
    public class HomeController (IOptions<AppSettings> appSettings, ScormDbContext context) : Controller
    {
        public async Task<IActionResult> Index()
        {
            ViewBag.CourseCount = await context.Courses.CountAsync();
            return View();
        }
    }
}
