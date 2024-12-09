using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class PaymentTransaction : BaseEntity
    {
        public Guid PaymentId { get; set; }
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public string PaymentGatewayTransactionId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Enum: Payment, Refund
        public string PaymentMethod { get; set; } // Enum: VnPay, PayOS
        public string Status { get; set; } // Enum: Completed, Pending, Failed
        public string TransactionLog { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation properties
        public Payment Payment { get; set; }
        public CustomerOrder CustomerOrder { get; set; }
        public User Customer { get; set; }
    }
}
