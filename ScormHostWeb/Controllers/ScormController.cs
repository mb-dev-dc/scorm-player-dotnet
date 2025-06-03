using Microsoft.AspNetCore.Mvc;

namespace ScormHost.Web.Controllers
{
    public class ScormController : Controller
    {
        public IActionResult Launch(Guid? courseId = null)
        {
            // TODO: Auth, user context, load SCO start page, pass token to view
            ViewBag.CourseId = courseId ?? Guid.Empty;
            return View();
        }
    }
}
