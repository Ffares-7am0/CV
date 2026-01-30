using HospitalAppointmentSchedulingSystemMVC.Data;
using HospitalAppointmentSchedulingSystemMVC.Models;
using Microsoft.AspNetCore.Mvc;

namespace HospitalAppointmentSchedulingSystemMVC.Controllers
{
    public class AppointmentController : Controller
    {
        private readonly HospitalAppointmentSchedulingContext context;
        public AppointmentController(HospitalAppointmentSchedulingContext _context)
        {
            context = _context;
        }
        public IActionResult Index()
        {
            var appointments = context.appointments.ToList();
            return View(appointments);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(Appointment appointment)
        {
            if (ModelState.IsValid)
            {
                context.appointments.Add(appointment);
                context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View();
        }
        [HttpGet]
        public IActionResult Edit(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var appointment = context.appointments.FirstOrDefault(x => x.Id == Id);
            if (appointment == null)
            {
                return NotFound();
            }

            return View(appointment);
        }

        [HttpPost]
        public IActionResult Edit(int? Id, Appointment appointment)
        {
            if (Id != appointment.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                context.Update(appointment);
                context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
        [HttpGet]
        public IActionResult Details(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var appointment = context.appointments.FirstOrDefault(x => x.Id == Id);
            if (appointment == null)
            {
                return NotFound();
            }
            return View(appointment);
        }

        [HttpGet]
        public IActionResult Delete(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }
            var appointment = context.appointments.FirstOrDefault(x => x.Id == Id);
            if (appointment == null)
            {
                return NotFound();
            }
            context.appointments.Remove(appointment);
            context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
