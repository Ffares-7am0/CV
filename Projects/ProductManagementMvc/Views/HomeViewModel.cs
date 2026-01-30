using ProductManagementMvc.Models;

public class HomeViewModel
{
    public IEnumerable<Product> Products { get; set; } = new List<Product>();
    public IEnumerable<Category> Categories { get; set; } = new List<Category>();
    public int? CurrentCategoryId { get; set; }
}