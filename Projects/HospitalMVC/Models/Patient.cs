using System.ComponentModel.DataAnnotations;

public class Patient
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; }

    [DataType(DataType.Date)]
    public DateTime DateOfBirth { get; set; }

    [StringLength(20)]
    public string ContactNumber { get; set; }

    // Navigation property
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}