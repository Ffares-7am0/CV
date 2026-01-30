using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Fine
    {
        public int FineId { get; set; }

        [ForeignKey("Member")]
        public int MemberId { get; set; }
        public virtual Member Member { get; set; }

        // ممكن تكون مربوطة باستعارة وممكن لا (غرامة تلف مثلا)
        public int? TransactionId { get; set; }

        public decimal Amount { get; set; }
        public string Reason { get; set; }
        public DateTime IssueDate { get; set; } = DateTime.Now;
        public DateTime? PaymentDate { get; set; }

        public FineStatus Status { get; set; }
    }
}