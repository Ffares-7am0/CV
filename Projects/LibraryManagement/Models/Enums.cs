namespace LibraryManagement.Models
{
    public enum BorrowStatus
    {
        Active,
        Returned,
        Overdue
    }

    public enum ReservationStatus
    {
        Active,
        Fulfilled,
        Cancelled,
        Expired
    }

    public enum FineStatus
    {
        Pending,
        Paid,
        Waived
    }
}