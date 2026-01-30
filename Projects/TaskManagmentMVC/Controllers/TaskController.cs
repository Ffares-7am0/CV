using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using System.Threading.Tasks;

public class TaskController : Controller
{
    private readonly TaskManagementContext _context;

    public TaskController(TaskManagementContext context)
    {
        _context = context;
    }

    private void PopulateDropdowns(object selectedProject = null, object selectedMember = null)
    {
        ViewData["ProjectId"] = new SelectList(_context.Projects.OrderBy(p => p.Name), "Id", "Name", selectedProject);
        ViewData["TeamMemberId"] = new SelectList(_context.TeamMembers.OrderBy(tm => tm.Name), "Id", "Name", selectedMember);
    }

    public async Task<IActionResult> Index()
    {
        var taskManagementContext = _context.Tasks.Include(t => t.Project).Include(t => t.AssignedMember);
        return View(await taskManagementContext.ToListAsync());
    }

    public IActionResult Create(int? projectId)
    {
        PopulateDropdowns(projectId);
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Tasks task)
    {
        ModelState.Remove("Project");
        ModelState.Remove("AssignedMember");

        if (ModelState.IsValid)
        {
            _context.Add(task);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        PopulateDropdowns(task.ProjectId, task.TeamMemberId);
        return View(task);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        PopulateDropdowns(task.ProjectId, task.TeamMemberId);
        return View(task);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Tasks task)
    {
        if (id != task.Id)
        {
            return NotFound();
        }

        ModelState.Remove("Project");
        ModelState.Remove("AssignedMember");

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(task);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }

        PopulateDropdowns(task.ProjectId, task.TeamMemberId);
        return View(task);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var task = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedMember)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        return View(task);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task != null)
        {
            _context.Tasks.Remove(task);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}