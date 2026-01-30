using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.ViewModels;
using LibraryManagement.Models;
using LibraryManagement.Data.Repositories;

namespace LibraryManagement.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IMemberRepository _memberRepository;

        public AccountController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IMemberRepository memberRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _memberRepository = memberRepository;
        }

        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        // ------------------------------------------
        // POST: Login 
        // ------------------------------------------

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                // محاولة تسجيل الدخول
                var result = await _signInManager.PasswordSignInAsync(
                    model.Email,
                    model.Password,
                    model.RememberMe,
                    lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    // لو تم الدخول بنجاح، اذهب إلى الصفحة المطلوبة أو الصفحة الرئيسية
                    return RedirectToLocal(returnUrl);
                }

                // رسالة خطأ بسيطة
                ModelState.AddModelError(string.Empty, "فشل تسجيل الدخول. تأكد من البيانات.");
            }

            // لو الـ ModelState مش صحيح أو فشل الدخول، ارجع لنفس الـ View
            return View(model);
        }

        // ------------------------------------------
        // GET: Register 
        // ------------------------------------------

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        // ------------------------------------------
        // POST: Register 
        // ------------------------------------------

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                // 1. إنشاء IdentityUser
                var user = new IdentityUser { UserName = model.Email, Email = model.Email, PhoneNumber = model.PhoneNumber };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // 3. إنشاء Member Profile
                    var newMember = new Member
                    {
                        UserId = user.Id,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Email = model.Email,
                        PhoneNumber = model.PhoneNumber,
                        MembershipDate = DateTime.Now,
                        MembershipExpiryDate = DateTime.Now.AddYears(1), // سنة كاملة
                        MembershipNumber = await _memberRepository.GenerateMembershipNumberAsync(), // توليد رقم العضوية
                        MaxBooksAllowed = 3, // حسب Business Rule: الحد الأقصى المبدئي 3
                        IsActive = true
                    };

                    await _memberRepository.AddAsync(newMember);
                    await _memberRepository.SaveChangesAsync();

                    // 4. تسجيل الدخول مباشرة بعد التسجيل
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    return RedirectToAction("Index", "Home");
                }

                // إضافة رسائل الخطأ من Identity إلى ModelState
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // لو فشل، ارجع للـ View
            return View(model);
        }

        // ------------------------------------------
        // POST: Logout 
        // ------------------------------------------

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        // ------------------------------------------
        // مساعدة في إعادة التوجيه
        // ------------------------------------------

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
    }
}