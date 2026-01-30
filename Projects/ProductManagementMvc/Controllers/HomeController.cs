using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementMvc.Models;
using System.Linq;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Index(int? categoryId)
    {
        var categories = _context.Categories.ToList();
        IQueryable<Product> productsQuery = _context.Products.Include(p => p.Category);

        if (categoryId.HasValue && categoryId.Value > 0)
        {
            productsQuery = productsQuery.Where(p => p.CategoryId == categoryId.Value);
        }

        var products = productsQuery.ToList();

        var viewModel = new HomeViewModel
        {
            Products = products,
            Categories = categories,
            CurrentCategoryId = categoryId
        };

        return View(viewModel);
    }

}