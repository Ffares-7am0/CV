using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace School.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public Grade Grade { get; set; }
        public int DeptId { get; set; }
        [ForeignKey(nameof(DeptId))]
        public Department Department { get; set; }
        public ICollection<StudentCourse> Courses { get; set; }
    }
    public enum Grade
    {
        J, W, S
    }
}
