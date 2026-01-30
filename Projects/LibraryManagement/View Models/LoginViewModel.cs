using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.ViewModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "الايميل مطلوب")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "الباسورد مطلوب")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}