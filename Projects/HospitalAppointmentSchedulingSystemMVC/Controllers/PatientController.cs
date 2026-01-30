using HospitalAppointmentSchedulingSystemMVC.Data;
using HospitalAppointmentSchedulingSystemMVC.Models;
using Microsoft.AspNetCore.Mvc;

namespace HospitalAppointmentSchedulingSystemMVC.Controllers
{
    public class PatientController : Controller
    {
        private readonly HospitalAppointmentSchedulingContext context;
        public PatientController(HospitalAppointmentSchedulingContext _context)
        {
            context = _context;
        }
        public IActionResult Index()
        {
            var patients = context.patients.ToList();
            return View(patients);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(Patient patient)
        {
            if (ModelState.IsValid)
            {
                context.patients.Add(patient);
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

            var patient = context.patients.FirstOrDefault(x => x.Id == Id);
            if (patient == null)
            {
                return NotFound();
            }

            return View(patient);
        }

        [HttpPost]
        public IActionResult Edit(int? Id, Patient patient)
        {
            if (Id != patient.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                context.Update(patient);
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

            var patient = context.patients.FirstOrDefault(x => x.Id == Id);
            if (patient == null)
            {
                return NotFound();
            }
            return View(patient);
        }

        [HttpGet]
        public IActionResult Delete(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }
            var patient = context.patients.FirstOrDefault(x => x.Id == Id);
            if (patient == null)
            {
                return NotFound();
            }
            context.patients.Remove(patient);
            context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
