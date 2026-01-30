using Microsoft.AspNetCore.Mvc;
using TaskManagementSystemMVC.Data;

namespace TaskManagementSystemMVC.Controllers
{
    public class TeamMemberController : Controller
    {
        private readonly TaskManagementContext _context;
        public TeamMemberController(TaskManagementContext taskManagementContext)
        {
            _context = taskManagementContext;
        }
        public IActionResult Index()
        {
            var teamMembers = _context.TeamMembers.ToList();
            return View(teamMembers);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
    }
}
