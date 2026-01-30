using Microsoft.AspNetCore.Mvc;
using TaskManagementSystemMVC.Data;

namespace TaskManagementSystemMVC.Controllers
{
    public class TaskController : Controller
    {
        private readonly TaskManagementContext _context;
        public TaskController(TaskManagementContext taskManagementContext)
        {
            _context = taskManagementContext;
        }
        public IActionResult Index()
        {
            var tasks = _context.Tasks.ToList();
            return View(tasks);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
    }
}
