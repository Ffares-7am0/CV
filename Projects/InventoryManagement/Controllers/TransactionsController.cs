using InventoryManagement.Data;
using InventoryManagement.Models;
using InventoryManagement.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly InventoryDbContext _context;

        public TransactionsController(InventoryDbContext context)
        {
            _context = context;
        }

        public IActionResult RecordInbound()
        {
            var viewModel = new TransactionViewModel
            {
                TransactionType = TransactionType.Inbound,
                Products = new SelectList(_context.Products, "Id", "Name"),
                Suppliers = new SelectList(_context.Suppliers, "Id", "Name")
            };
            return View("RecordTransaction", viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RecordInbound(TransactionViewModel model)
        {
            
            var product = await _context.Products.FindAsync(model.ProductId);
            if (product == null)
            {
                ModelState.AddModelError("", "Product not found");
                return View("RecordTransaction", PrepareViewModel(model));
            }

            var transaction = new Transaction
            {
                ProductId = model.ProductId,
                SupplierId = model.SupplierId,
                Quantity = model.Quantity,
                TransactionType = TransactionType.Inbound,
                TransactionDate = DateTime.Now
            };

            product.StockLevel += model.Quantity;

            _context.Transactions.Add(transaction);
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return RedirectToAction("Details", "Products", new { id = model.ProductId });
        }

        public IActionResult RecordOutbound()
        {
            var viewModel = new TransactionViewModel
            {
                TransactionType = TransactionType.Outbound,
                Products = new SelectList(_context.Products, "Id", "Name"),
                Suppliers = new SelectList(_context.Suppliers, "Id", "Name")
            };
            return View("RecordTransaction", viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RecordOutbound(TransactionViewModel model)
        {
            
            var product = await _context.Products.FindAsync(model.ProductId);
            if (product == null)
            {
                ModelState.AddModelError("", "Product not found");
                return View("RecordTransaction", PrepareViewModel(model));
            }

            if (product.StockLevel < model.Quantity)
            {
                ModelState.AddModelError("Quantity", $"Insufficient stock. Available: {product.StockLevel}");
                return View("RecordTransaction", PrepareViewModel(model));
            }

            var transaction = new Transaction
            {
                ProductId = model.ProductId,
                SupplierId = model.SupplierId,
                Quantity = model.Quantity,
                TransactionType = TransactionType.Outbound,
                TransactionDate = DateTime.Now
            };

            product.StockLevel -= model.Quantity;

            _context.Transactions.Add(transaction);
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return RedirectToAction("Details", "Products", new { id = model.ProductId });
        }

        private TransactionViewModel PrepareViewModel(TransactionViewModel model)
        {
            model.Products = new SelectList(_context.Products, "Id", "Name", model.ProductId);
            model.Suppliers = new SelectList(_context.Suppliers, "Id", "Name", model.SupplierId);
            return model;
        }
    }
}