using LibraryManagement.Models;
using Microsoft.AspNetCore.Mvc.Rendering; // عشان SelectListItem
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.ViewModels
{
    public class BookFormViewModel
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

        public string CoverImageUrl { get; set; }

        [Range(1, 1000)]
        public int TotalCopies { get; set; }

        [Display(Name = "Category")]
        public int CategoryId { get; set; }

        // دي اللي هتشيل لستة الأقسام عشان الـ Dropdown
        public IEnumerable<SelectListItem> Categories { get; set; }
    }
}