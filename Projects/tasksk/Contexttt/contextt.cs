using Microsoft.EntityFrameworkCore;
using tasksk.Models;

namespace tasksk.Contexttt
{
    public class contextt :DbContext
    {

        public contextt(DbContextOptions<contextt> options) : base(options) { }
        public contextt() { }
        
       
        public DbSet<Students> Students { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Courses> Courses { get; set; }
        public DbSet<StudentCourse> StudentCourses { get; set; }

    }
}
