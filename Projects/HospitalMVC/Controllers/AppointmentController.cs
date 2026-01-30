using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using System.Threading.Tasks;


public class AppointmentsController : Controller
{
    private readonly ApplicationDbContext _context;

    public AppointmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private void PopulateDropdowns(object selectedDoctor = null, object selectedPatient = null)
    {
        ViewData["DoctorId"] = new SelectList(_context.Doctors.OrderBy(d => d.Name), "Id", "Name", selectedDoctor);
        ViewData["PatientId"] = new SelectList(_context.Patients.OrderBy(p => p.Name), "Id", "Name", selectedPatient);
    }

    private bool IsAppointmentOverlapping(int doctorId, DateTime start, int durationMinutes, int? excludeAppointmentId = null)
    {
        var end = start.AddMinutes(durationMinutes);

        var appointmentsQuery = _context.Appointments
            .Where(a => a.DoctorId == doctorId && a.Status != AppointmentStatus.Cancelled);

        if (excludeAppointmentId.HasValue)
        {
            appointmentsQuery = appointmentsQuery.Where(a => a.Id != excludeAppointmentId.Value);
        }

        var overlappingAppointments = appointmentsQuery
            .ToList()
            .Any(a =>
                (start >= a.AppointmentDateTime && start < a.AppointmentDateTime.AddMinutes(a.DurationMinutes)) ||
                (end > a.AppointmentDateTime && end <= a.AppointmentDateTime.AddMinutes(a.DurationMinutes)) ||
                (a.AppointmentDateTime >= start && a.AppointmentDateTime.AddMinutes(a.DurationMinutes) <= end)
            );

        return overlappingAppointments;
    }

    public async Task<IActionResult> Index()
    {
        var applicationDbContext = _context.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .OrderByDescending(a => a.AppointmentDateTime);
        return View(await applicationDbContext.ToListAsync());
    }

    public IActionResult Create()
    {
        PopulateDropdowns();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,DoctorId,PatientId,AppointmentDateTime,DurationMinutes,Status")] Appointment appointment)
    {
        ModelState.Remove("Doctor");
        ModelState.Remove("Patient");

        if (ModelState.IsValid)
        {
            if (IsAppointmentOverlapping(appointment.DoctorId, appointment.AppointmentDateTime, appointment.DurationMinutes))
            {
                ModelState.AddModelError("AppointmentDateTime", "Doctor already has an overlapping appointment at this time.");
            }
            else
            {
                _context.Add(appointment);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
        }

        PopulateDropdowns(appointment.DoctorId, appointment.PatientId);
        return View(appointment);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
        {
            return NotFound();
        }

        PopulateDropdowns(appointment.DoctorId, appointment.PatientId);
        return View(appointment);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,DoctorId,PatientId,AppointmentDateTime,DurationMinutes,Status")] Appointment appointment)
    {
        if (id != appointment.Id)
        {
            return NotFound();
        }

        ModelState.Remove("Doctor");
        ModelState.Remove("Patient");

        if (ModelState.IsValid)
        {
            if (IsAppointmentOverlapping(appointment.DoctorId, appointment.AppointmentDateTime, appointment.DurationMinutes, appointment.Id))
            {
                ModelState.AddModelError("AppointmentDateTime", "Doctor already has an overlapping appointment at this time.");
            }
            else
            {
                try
                {
                    _context.Update(appointment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Appointments.Any(e => e.Id == id))
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
        }

        PopulateDropdowns(appointment.DoctorId, appointment.PatientId);
        return View(appointment);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var appointment = await _context.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (appointment == null)
        {
            return NotFound();
        }

        return View(appointment);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment != null)
        {
            _context.Appointments.Remove(appointment);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}