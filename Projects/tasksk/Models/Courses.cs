using System.ComponentModel.DataAnnotations;

namespace tasksk.Models
{
    public class Courses
    {
        [Key] 
        public int C_Id { get; set; }

        [Required] 
        [MaxLength(100)]
        public string Name { get; set; }

      
        public ICollection<StudentCourse> StudentCourses { get; set; } = new HashSet<StudentCourse>();
    }
}