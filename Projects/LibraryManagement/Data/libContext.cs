using Microsoft.EntityFrameworkCore;
using LibraryManagement.Models;

namespace LibraryManagement.Data
{
    public class libContext : DbContext
    {
        public libContext(DbContextOptions<libContext> options) :base(options)
        {
            
        }
        public DbSet<Book> books { get; set; }
        public DbSet<BorrowTransaction> borrowTransactions { get; set; }
        public DbSet<Category> categories { get; set; }
        public DbSet<Fine> fines { get; set; }
        public DbSet<Member> members { get; set; }
        public DbSet<Reservation> reservation { get; set; }
    }
}
