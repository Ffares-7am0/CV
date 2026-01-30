using System.ComponentModel.DataAnnotations;

namespace HospitalAppointmentSchedulingSystemMVC.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string? Name { get; set; }

        public DateOnly DateOfBirth { get; set; }

        [StringLength(50, ErrorMessage = "Contact Number cannot exceed 50 characters")]
        public string? ContactNumber { get; set; }

        public ICollection<Appointment> appointments { get; set; } = new List<Appointment>();
    }
}
