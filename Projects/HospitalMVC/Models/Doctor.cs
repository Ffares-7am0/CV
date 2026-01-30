using System.ComponentModel.DataAnnotations;

public class Doctor
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; }

    [Required, StringLength(50)]
    public string Specialty { get; set; }

    [Required, StringLength(100), EmailAddress]
    public string Email { get; set; }

    // Navigation property
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}