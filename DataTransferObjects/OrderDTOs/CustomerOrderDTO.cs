using DataTransferObjects.PaymentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.OrderDTOs
{
    public class CustomerOrderDTO
    {
        public Guid CustomerId { get; set; }
        public string Status { get; set; } // Enum: Pending, Accepted, In Production, etc.
        public decimal TotalPrice { get; set; }
        public decimal ShippingPrice { get; set; }
        public decimal DepositPaid { get; set; }
        public DateTime OrderDate { get; set; }

        public ICollection<PaymentDTO>? Payments {  get; set; }
    }
}
