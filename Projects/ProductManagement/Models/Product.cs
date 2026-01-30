
using System.ComponentModel.DataAnnotations;

// Models/Product.cs
public class Product
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    [Required]
    public decimal Price { get; set; }

    // مفتاح خارجي (Foreign Key)
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}