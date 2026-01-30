using LibraryManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Data.Repositories
{
    public class MemberRepository : Repository<Member>, IMemberRepository
    {
        public MemberRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Member> GetMemberByUserIdAsync(string userId)
        {
            return await _dbSet.FirstOrDefaultAsync(m => m.UserId == userId);
        }

        public async Task<string> GenerateMembershipNumberAsync()
        {
            int currentYear = DateTime.Now.Year;
            int count = await _dbSet.CountAsync(m => m.MembershipDate.Year == currentYear);

            // التنسيق: LIB-YYYY-NNNN
            return $"LIB-{currentYear}-{count + 1:D4}";
        }
    }
}