using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LibraryManagement.Models;
using LibraryManagement.Data.Repositories;

namespace LibraryManagement.Controllers
{
    // السماح فقط للمستخدمين الذين لديهم دور "Admin"
    [Authorize(Roles = "Admin")]
    public class CategoriesController : Controller
    {
        private readonly IRepository<Category> _categoryRepository;

        public CategoriesController(IRepository<Category> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // ------------------------------------------
        // GET: Categories/Index - عرض كل الأقسام
        // ------------------------------------------
        public async Task<IActionResult> Index()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return View(categories);
        }

        // ------------------------------------------
        // GET: Categories/Create - عرض صفحة الإضافة
        // ------------------------------------------
        public IActionResult Create()
        {
            return View();
        }

        // ------------------------------------------
        // POST: Categories/Create - إضافة قسم جديد
        // ------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Category category)
        {
            if (ModelState.IsValid)
            {
                await _categoryRepository.AddAsync(category);
                await _categoryRepository.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // ------------------------------------------
        // GET: Categories/Edit/5 - عرض صفحة التعديل
        // ------------------------------------------
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = await _categoryRepository.GetByIdAsync(id.Value);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        // ------------------------------------------
        // POST: Categories/Edit/5 - حفظ التعديلات
        // ------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Category category)
        {
            if (id != category.CategoryId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _categoryRepository.Update(category);
                    await _categoryRepository.SaveChangesAsync();
                }
                catch (Exception)
                {
                    // يمكن إضافة منطق للتحقق من وجود الكيان قبل التعديل هنا
                    if (await _categoryRepository.GetByIdAsync(id) == null)
                    {
                        return NotFound();
                    }
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // ------------------------------------------
        // GET: Categories/Delete/5 - عرض تأكيد الحذف
        // ------------------------------------------
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = await _categoryRepository.GetByIdAsync(id.Value);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // ------------------------------------------
        // POST: Categories/Delete/5 - تنفيذ الحذف
        // ------------------------------------------
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category != null)
            {
                _categoryRepository.Remove(category);
                await _categoryRepository.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}