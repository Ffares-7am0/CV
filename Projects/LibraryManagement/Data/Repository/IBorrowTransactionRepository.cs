using LibraryManagement.Models;

namespace LibraryManagement.Data.Repositories
{
    public interface IBorrowTransactionRepository : IRepository<BorrowTransaction>
    {
        Task<IEnumerable<BorrowTransaction>> GetActiveTransactionsByMemberAsync(int memberId);

        Task<IEnumerable<BorrowTransaction>> GetOverdueTransactionsAsync();

        Task<BorrowTransaction> GetTransactionDetailsAsync(int transactionId);
    }
}