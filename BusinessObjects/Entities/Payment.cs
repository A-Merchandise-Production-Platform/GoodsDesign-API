namespace BusinessObjects.Entities
{
    public class Payment : BaseEntity
    {
        public Guid CustomerOrderId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Enum: Deposit, Withdrawn

        public int OrderCode { get; set; } = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
        public string PaymentLog { get; set; } // E.g., Payment FirstTime, SecondTime
        public string Status { get; set; } // Enum: Pending, Completed
        public DateTime CreatedDate { get; set; }

        // Navigation properties
        public CustomerOrder CustomerOrder { get; set; }
        public User Customer { get; set; }
    }
}
