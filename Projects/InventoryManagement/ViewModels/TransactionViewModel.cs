using System.ComponentModel.DataAnnotations;
using InventoryManagement.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace InventoryManagement.ViewModels
{
    public class TransactionViewModel
    {
        [Required]
        [Display(Name = "Product")]
        public int ProductId { get; set; }

        public int? SupplierId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        [Display(Name = "Transaction Type")]
        public TransactionType TransactionType { get; set; }

        public SelectList Products { get; set; }
        public SelectList Suppliers { get; set; }
    }

    public class ProductDetailsViewModel
    {
        public Product Product { get; set; }
        public List<Transaction> Transactions { get; set; }
    }

    public class SupplierDetailsViewModel
    {
        public Supplier Supplier { get; set; }
        public List<Product> Products { get; set; }
    }
}