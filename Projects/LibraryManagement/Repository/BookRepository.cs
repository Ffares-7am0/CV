using LibraryManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Data.Repositories
{
    public class BookRepository : Repository<Book>, IBookRepository
    {
        public BookRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Book> GetBookWithCategoryAsync(int id)
        {
            return await _dbSet
                .Include(b => b.Category) // لربط البيانات بالـ Category
                .FirstOrDefaultAsync(b => b.BookId == id);
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm, int? categoryId, bool showAvailableOnly)
        {
            IQueryable<Book> query = _dbSet.Include(b => b.Category);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                // بحث بسيط على 3 حقول
                query = query.Where(b =>
                    b.Title.Contains(searchTerm) ||
                    b.Author.Contains(searchTerm) ||
                    b.ISBN.Contains(searchTerm)
                );
            }

            if (categoryId.HasValue && categoryId.Value > 0)
            {
                query = query.Where(b => b.CategoryId == categoryId.Value);
            }

            if (showAvailableOnly)
            {
                query = query.Where(b => b.AvailableCopies > 0);
            }

            return await query.ToListAsync();
        }
    }
}