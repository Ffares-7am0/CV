using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Models
{
    public class Member
    {
        public int MemberId { get; set; }

        // ربط مع جدول اليوزرز بتاع الـ Identity
        public string UserId { get; set; }

        public string MembershipNumber { get; set; } // LIB-2024-001

        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } // للتسهيل هنكرر الايميل هنا للعرض

        public string PhoneNumber { get; set; }

        public DateTime MembershipDate { get; set; } = DateTime.Now;
        public DateTime MembershipExpiryDate { get; set; }

        public bool IsActive { get; set; } = true;
        public int MaxBooksAllowed { get; set; } = 5;
        public decimal OutstandingFees { get; set; } = 0;
    }
}