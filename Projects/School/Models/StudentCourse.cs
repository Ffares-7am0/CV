using System.ComponentModel.DataAnnotations.Schema;

namespace School.Models
{
    public class StudentCourse
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public decimal Deqree {  get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; }
        [ForeignKey(nameof(CourseId))]
        public Course Course { get; set; }

    }
}
