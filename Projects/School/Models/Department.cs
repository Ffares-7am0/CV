using System.ComponentModel.DataAnnotations;

namespace School.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; } 
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<Student> Students { get; set; }
    }
}
