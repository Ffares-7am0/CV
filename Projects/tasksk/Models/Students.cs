using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tasksk.Models
{
    public class Students
    {
        [Key] 
        public int Id { get; set; }

     
        [MaxLength(255)]
        public string ImageUrl { get; set; } 

        [Required] 
        [MaxLength(150)]
        public string Name { get; set; }

        
        [ForeignKey("D_Id")]
        public Department Department { get; set; }

        [Required] 
        public int D_Id { get; set; }

      
        public ICollection<StudentCourse> StudentCourses { get; set; } = new HashSet<StudentCourse>();
    }
}