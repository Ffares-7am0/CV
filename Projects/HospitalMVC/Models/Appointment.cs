using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum AppointmentStatus { Scheduled, Completed, Cancelled }

public class Appointment
{
    public int Id { get; set; }

    public int DoctorId { get; set; }
    public int PatientId { get; set; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime AppointmentDateTime { get; set; }

    public int DurationMinutes { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    [ForeignKey("DoctorId")]
    public Doctor Doctor { get; set; }

    [ForeignKey("PatientId")]
    public Patient Patient { get; set; }
}