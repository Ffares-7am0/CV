using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.ViewModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "الاسم الأول مطلوب")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "الاسم الأخير مطلوب")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "رقم التليفون مطلوب")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "الايميل مطلوب")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "الباسورد مطلوب")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "الباسورد غير متطابق")]
        public string ConfirmPassword { get; set; }
    }
}