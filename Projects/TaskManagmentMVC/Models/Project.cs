using System.ComponentModel.DataAnnotations;

public class Project
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string? Name { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [DataType(DataType.Date)]
    public DateTime StartDate { get; set; } = DateTime.Today;

    [DataType(DataType.Date)]
    public DateTime EndDate { get; set; }

    public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
}