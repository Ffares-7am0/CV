using HospitalAppointmentSchedulingSystemMVC.Models;
using HospitalAppointmentSchedulingSystemMVC.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace HospitalAppointmentSchedulingSystemMVC.Data
{
    public class HospitalAppointmentSchedulingContext : DbContext
    {
        public HospitalAppointmentSchedulingContext(DbContextOptions<HospitalAppointmentSchedulingContext> options) : base(options) { }
        public DbSet<Doctor> doctors { get; set; }
        public DbSet<Patient> patients { get; set; }
        public DbSet<Appointment> appointments { get; set; }
        public DbSet<ReadApointmentOfDoctors> readApoints { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReadApointmentOfDoctors>().HasNoKey();
        }

    }
    
}
