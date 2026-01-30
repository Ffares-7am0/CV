using HospitalAppointmentSchedulingSystemMVC.Models;

namespace HospitalAppointmentSchedulingSystemMVC.ViewModel
{
    public class ReadApointmentOfDoctors
    {
        public Doctor doctor {  get; set; }
        public ICollection<Appointment> appointments { get; set; }
    }
}
