using LibraryManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Data.Repositories
{
    public class BorrowTransactionRepository : Repository<BorrowTransaction>, IBorrowTransactionRepository
    {
        public BorrowTransactionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BorrowTransaction>> GetActiveTransactionsByMemberAsync(int memberId)
        {
            return await _dbSet
                .Where(t => t.MemberId == memberId && t.Status == BorrowStatus.Active)
                .ToListAsync();
        }

        public async Task<IEnumerable<BorrowTransaction>> GetOverdueTransactionsAsync()
        {
            return await _dbSet
               .Where(t => t.Status == BorrowStatus.Active && t.DueDate < DateTime.Today)
               .Include(t => t.Member)
               .Include(t => t.Book)
               .ToListAsync();
        }

        public async Task<BorrowTransaction> GetTransactionDetailsAsync(int transactionId)
        {
            return await _dbSet
                .Include(t => t.Member)
                .Include(t => t.Book)
                .FirstOrDefaultAsync(t => t.TransactionId == transactionId);
        }
    }
}