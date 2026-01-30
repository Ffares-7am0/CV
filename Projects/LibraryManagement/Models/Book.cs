using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Book
    {
        public int BookId { get; set; }

        [Required, MaxLength(13)]
        public string ISBN { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; }

        [Required, MaxLength(100)]
        public string Author { get; set; }

        public string Publisher { get; set; }

        [Range(1000, 9999)]
        public int PublicationYear { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        public string CoverImageUrl { get; set; } // هنخزن مسار الصورة بس

        [Range(1, 1000)]
        public int TotalCopies { get; set; }

        public int AvailableCopies { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Foreign Key
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}