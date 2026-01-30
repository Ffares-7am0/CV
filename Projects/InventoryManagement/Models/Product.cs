using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string SKU { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public int StockLevel { get; set; }

        [StringLength(500)]
        public string Description { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
    }

    public class Supplier
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string ContactEmail { get; set; }

        [StringLength(20)]
        [Phone]
        public string Phone { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
    }

    public class Transaction
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        public int? SupplierId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        public TransactionType TransactionType { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        public Product Product { get; set; }
        public Supplier Supplier { get; set; }
    }

    public enum TransactionType
    {
        Inbound,
        Outbound
    }
}