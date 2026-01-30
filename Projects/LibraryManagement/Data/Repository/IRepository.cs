using System.Linq.Expressions;

namespace LibraryManagement.Data.Repositories
{
    public interface IRepository<T> where T : class
    {
       
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);

        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        // CRUD Operations
        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);

        // Save Changes
        Task<int> SaveChangesAsync();
    }
}