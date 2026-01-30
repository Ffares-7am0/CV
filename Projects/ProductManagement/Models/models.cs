

using System.ComponentModel.DataAnnotations;

public class RegisterViewModel
{
    // ... نفس كود الـ RegisterViewModel الذي قدمناه سابقاً ...
    // سنستخدمه هنا أيضاً.
}

// Models/LoginViewModel.cs (لتبسيط عملية الدخول)
public class LoginViewModel
{
    [Required(ErrorMessage = "اسم المستخدم مطلوب.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "كلمة المرور مطلوبة.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
}