using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class Payment : BaseEntity
    {
        public Guid CustomerOrderId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Enum: Deposit, Withdrawn
        public string PaymentLog { get; set; } // E.g., Payment FirstTime, SecondTime
        public string Status { get; set; } // Enum: Pending, Completed
        public DateTime CreatedDate { get; set; }

        // Navigation properties
        public CustomerOrder CustomerOrder { get; set; }
        public User Customer { get; set; }
    }
}
