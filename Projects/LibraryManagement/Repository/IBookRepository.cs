using LibraryManagement.Models;

namespace LibraryManagement.Data.Repositories
{
    public interface IBookRepository : IRepository<Book>
    {
        Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm, int? categoryId, bool showAvailableOnly);

        Task<Book> GetBookWithCategoryAsync(int id);
    }
}