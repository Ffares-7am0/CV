using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Reservation
    {
        public int ReservationId { get; set; }

        [ForeignKey("Member")]
        public int MemberId { get; set; }
        public virtual Member Member { get; set; }

        [ForeignKey("Book")]
        public int BookId { get; set; }
        public virtual Book Book { get; set; }

        public DateTime ReservationDate { get; set; } = DateTime.Now;
        public DateTime ExpiryDate { get; set; } // لما الكتاب يبقى متاح، الحجز يفضل قد ايه

        public ReservationStatus Status { get; set; }
    }
}