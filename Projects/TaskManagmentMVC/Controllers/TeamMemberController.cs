using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class TeamMemberController : Controller
{
    private readonly TaskManagementContext _context;

    public TeamMemberController(TaskManagementContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        return View(await _context.TeamMembers.OrderBy(tm => tm.Name).ToListAsync());
    }

    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var teamMember = await _context.TeamMembers
            .Include(tm => tm.Tasks)
                .ThenInclude(t => t.Project)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (teamMember == null)
        {
            return NotFound();
        }

        teamMember.Tasks = teamMember.Tasks.OrderByDescending(t => t.Deadline).ToList();

        return View(teamMember);
    }

    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(TeamMember teamMember)
    {
        if (ModelState.IsValid)
        {
            _context.Add(teamMember);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(teamMember);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var teamMember = await _context.TeamMembers.FindAsync(id);
        if (teamMember == null)
        {
            return NotFound();
        }
        return View(teamMember);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, TeamMember teamMember)
    {
        if (id != teamMember.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(teamMember);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TeamMembers.Any(e => e.Id == id))
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
        return View(teamMember);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var teamMember = await _context.TeamMembers
            .FirstOrDefaultAsync(m => m.Id == id);
        if (teamMember == null)
        {
            return NotFound();
        }

        return View(teamMember);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var teamMember = await _context.TeamMembers.FindAsync(id);
        if (teamMember != null)
        {
            _context.TeamMembers.Remove(teamMember);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}