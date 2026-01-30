using System.ComponentModel.DataAnnotations;

namespace HospitalAppointmentSchedulingSystemMVC.Models
{
    public class Doctor
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        [StringLength(50, ErrorMessage = "Specialty cannot exceed 50 characters")]
        public string? Specialty { get; set; }

        public ICollection<Appointment> appointments { get; set; } = new List<Appointment>();
    }
}
