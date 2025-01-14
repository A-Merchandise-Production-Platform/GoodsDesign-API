using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.PaymentDTOs
{
    public class PaymentCreateDTO
    {
        public Guid CustomerOrderId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Enum: Deposit, Withdrawn
        public string PaymentLog { get; set; } // E.g., Payment FirstTime, SecondTime
    }
}
