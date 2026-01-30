using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Models
{
    public class Category
    {
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "اسم القسم مطلوب")]
        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }

        // Navigation Property (One Category has many Books)
        public virtual ICollection<Book> Books { get; set; }
    }
}