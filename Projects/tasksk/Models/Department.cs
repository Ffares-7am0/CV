using System.ComponentModel.DataAnnotations;

namespace tasksk.Models
{
    public class Department
    {
        [Key] 
        public int D_Id { get; set; }

        [Required]
        [MaxLength(100)] 
        public string Name { get; set; }

        
        public ICollection<Students> Students { get; set; } = new HashSet<Students>();
    }
}