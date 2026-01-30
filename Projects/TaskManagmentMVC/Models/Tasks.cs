using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum TaskStatus { Pending, InProgress, Completed }
public enum TaskPriority { Low, Medium, High }

public class Tasks
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string? Title { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public TaskStatus Status { get; set; } = TaskStatus.Pending;

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    [DataType(DataType.DateTime)]
    public DateTime Deadline { get; set; } = DateTime.Today.AddDays(7);

    public int ProjectId { get; set; }
    public int TeamMemberId { get; set; }

    [ForeignKey("ProjectId")]
    public Project? Project { get; set; }

    [ForeignKey("TeamMemberId")]
    public TeamMember? AssignedMember { get; set; }
}