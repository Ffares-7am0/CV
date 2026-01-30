using HospitalAppointmentSchedulingSystemMVC.Data;
using HospitalAppointmentSchedulingSystemMVC.Models;
using HospitalAppointmentSchedulingSystemMVC.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Security.Cryptography.Xml;

namespace HospitalAppointmentSchedulingSystemMVC.Controllers
{
    public class DoctorController : Controller
    {
        private readonly HospitalAppointmentSchedulingContext context;
        public DoctorController(HospitalAppointmentSchedulingContext _context)
        {
            context = _context;
            
        }
        public IActionResult Index()
        {
            var doctors = context.doctors.ToList();
            return View(doctors);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(Doctor doctor)
        { 
            if(ModelState.IsValid)
            {
                context.doctors.Add(doctor);
                context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View();
        }
        [HttpGet]
        public IActionResult Edit(int? Id)
        {
            if(Id == null){
                return NotFound();
            }

            var doctor = context.doctors.FirstOrDefault(x => x.Id == Id);
            if (doctor == null) {
                return NotFound();
            }

            return View(doctor);
        }

        [HttpPost]
        public IActionResult Edit(int? Id, Doctor doctor)
        {
            if(Id != doctor.Id)
            {
                return NotFound();
            }

            if(ModelState.IsValid)
            {
                context.Update(doctor);
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
            
            var doctor = context.readApoints.FirstOrDefault(x => x.doctor.Id == Id);
            if(doctor == null)
            {
                return NotFound();
            }
            return View(doctor);
        }

        [HttpGet]
        public IActionResult Delete(int? Id)
        {
            if(Id == null)
            {
                return NotFound();
            }
            var doctor = context.doctors.FirstOrDefault(x => x.Id == Id);
            if(doctor == null)
            {
                return NotFound();
            }
            context.doctors.Remove(doctor);
            context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
