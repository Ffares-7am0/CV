using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagementSystemMVC.Models
{
    public class TeamMembers
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        [StringLength(50, ErrorMessage = "Role cannot exceed 50 characters")]
        public string? Role { get; set; }

        public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
        [NotMapped]
        public int TotalTasks { get; set; }

        [NotMapped]
        public int CompletedTasks { get; set; }

        [NotMapped]
        public int PendingTasks => TotalTasks - CompletedTasks;

        [NotMapped]
        public decimal CompletionRate => TotalTasks > 0 ?
            (decimal)CompletedTasks / TotalTasks * 100 : 0;
    }
}
