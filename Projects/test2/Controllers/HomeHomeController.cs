using Microsoft.AspNetCore.Mvc;

namespace test2.Controllers
{
    public class HomeHomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult HomeHome()
        {
            return View();
        }
    }
}
