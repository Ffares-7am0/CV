using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystemMVC.Models
{
    public class Tasks
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string? Title { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Required]
        public TaskStatus Status { get; set; } = TaskStatus.Pending;

        [Required]
        public TaskPriority Priority { get; set; }

        [Required(ErrorMessage = "Deadline is required")]
        [DataType(DataType.Date)]
        public DateTime Deadline { get; set; }

        [Required]
        public int ProjectId { get; set; }
        public Projects? Project { get; set; }

        public int? TeamMemberId { get; set; }
        public TeamMembers? TeamMember { get; set; }
    }

    public enum TaskStatus
    {
        Pending,
        InProgress,
        Completed
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High
    }
}

