namespace BusinessObjects.Entities
{
    public class PaymentTransaction : BaseEntity
    {
        public Guid PaymentId { get; set; }
        public Guid CustomerId { get; set; }
        public long PaymentGatewayTransactionId { get; set; } = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
        public decimal Amount { get; set; }
        public string Type { get; set; } // Enum: Payment, Refund
        public string PaymentMethod { get; set; } // Enum: VnPay, PayOS
        public string Status { get; set; } // Enum: Completed, Pending, Failed
        public string TransactionLog { get; set; }

        // Navigation properties
        public Payment Payment { get; set; }
        public User Customer { get; set; }
    }
}
