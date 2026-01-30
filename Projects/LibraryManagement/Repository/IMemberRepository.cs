using LibraryManagement.Models;

namespace LibraryManagement.Data.Repositories
{
    public interface IMemberRepository : IRepository<Member>
    {
        Task<Member> GetMemberByUserIdAsync(string userId);

        Task<string> GenerateMembershipNumberAsync();
    }
}