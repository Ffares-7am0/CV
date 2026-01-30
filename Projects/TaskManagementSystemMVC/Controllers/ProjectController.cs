using Microsoft.AspNetCore.Mvc;
using TaskManagementSystemMVC.Data;
using TaskManagementSystemMVC.Models;

namespace TaskManagementSystemMVC.Controllers
{
    public class ProjectController : Controller
    {
        private readonly TaskManagementContext _context;
        public ProjectController(TaskManagementContext taskManagementContext)
        {
            _context = taskManagementContext;
        }
        public IActionResult Index()
        {
            var projects = _context.Projects.ToList();
            return View(projects);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Projects projects)
        {

            return View();
        }
    }
}
