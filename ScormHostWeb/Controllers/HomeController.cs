using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ScormHostWeb.Models;

namespace ScormHostWeb.Controllers
{
    public class HomeController (IOptions<AppSettings> appSettings) : Controller
    {
       
        public IActionResult Index()
        {
            return View();
        }
    }
}
