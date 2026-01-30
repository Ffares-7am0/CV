using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ProductManagementMvc.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;

public class ProductController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
    {
        _context = context;
        _webHostEnvironment = webHostEnvironment;
    }

    // (R) Read - Index 
    public IActionResult Index()
    {
        var products = _context.Products
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .ToList();

        return View(products);
    }

    // (C) Create - GET
    public IActionResult Create()
    {
        ViewBag.CategoryId = new SelectList(
            _context.Categories.OrderBy(c => c.Name).ToList(),
            "Id",
            "Name"
        );
        return View();
    }

    // (C) Create - POST (معالجة رفع الملف)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create([Bind("Id,Name,Description,Price,CategoryId")] Product product, IFormFile ImageFile)
    {
        if (ModelState.IsValid)
        {
            // 💡 منطق حفظ الملف الجديد
            if (ImageFile != null && ImageFile.Length > 0)
            {
                // **ملاحظة:** تم التأكد من استخدام مجلد "imgs" كما هو في الكود الذي قدمته
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "imgs");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + ImageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(fileStream);
                }

                product.ImageUrl = uniqueFileName;
            }

            _context.Add(product);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        ViewBag.CategoryId = new SelectList(
            _context.Categories.OrderBy(c => c.Name).ToList(),
            "Id", "Name", product.CategoryId
        );
        return View(product);
    }

    // (U) Update - GET 
    public IActionResult Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var product = _context.Products.Find(id);
        if (product == null)
        {
            return NotFound();
        }

        ViewBag.CategoryId = new SelectList(
            _context.Categories.OrderBy(c => c.Name).ToList(),
            "Id", "Name", product.CategoryId
        );
        return View(product);
    }

    // 🏆 (U) Update - POST (تعديل كامل مع تحديث الصورة)
    [HttpPost]
    [ValidateAntiForgeryToken]
    // 💡 التعديل هنا: ImageUrl تم إزالتها من [Bind] لاستقبالها من DB، وإضافة IFormFile
    public IActionResult Edit(int id, [Bind("Id,Name,Description,Price,CategoryId")] Product product, IFormFile ImageFile)
    {
        if (id != product.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            // 1. جلب بيانات المنتج الحالي من DB للحفاظ على قيمة ImageUrl القديمة
            var productToUpdate = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == id);

            if (productToUpdate == null) return NotFound();

            // 2. تحديث ملف الصورة
            if (ImageFile != null && ImageFile.Length > 0)
            {
                // أ. حذف الصورة القديمة (إذا كانت موجودة)
                if (!string.IsNullOrEmpty(productToUpdate.ImageUrl))
                {
                    string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "imgs", productToUpdate.ImageUrl);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // ب. حفظ الصورة الجديدة
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "imgs");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + ImageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(fileStream);
                }

                // ج. تحديث خاصية ImageUrl بالاسم الجديد
                product.ImageUrl = uniqueFileName;
            }
            else
            {
                // إذا لم يتم رفع ملف جديد، نحتفظ بالاسم القديم
                product.ImageUrl = productToUpdate.ImageUrl;
            }

            // 3. تحديث المنتج في قاعدة البيانات
            try
            {
                _context.Update(product);
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == product.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }

        ViewBag.CategoryId = new SelectList(
            _context.Categories.OrderBy(c => c.Name).ToList(),
            "Id", "Name", product.CategoryId
        );
        return View(product);
    }

    // (D) Delete - GET
    public IActionResult Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var product = _context.Products
            .Include(p => p.Category)
            .FirstOrDefault(m => m.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        return View(product);
    }

    // 🏆 (D) Delete - POST (تعديل كامل مع حذف الملف)
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public IActionResult DeleteConfirmed(int id)
    {
        var product = _context.Products.Find(id);
        if (product != null)
        {
            // 💡 منطق حذف الملف القديم من الخادم
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                string filePath = Path.Combine(_webHostEnvironment.WebRootPath, "imgs", product.ImageUrl);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            // حذف المنتج من قاعدة البيانات
            _context.Products.Remove(product);
            _context.SaveChanges();
        }
        return RedirectToAction(nameof(Index));
    }
}