using Microsoft.AspNetCore.Mvc;

namespace ScormHostWeb.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
