using System.ComponentModel.DataAnnotations;

public class TeamMember
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string? Name { get; set; }

    [Required, StringLength(100), EmailAddress]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? Role { get; set; }
    public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
}