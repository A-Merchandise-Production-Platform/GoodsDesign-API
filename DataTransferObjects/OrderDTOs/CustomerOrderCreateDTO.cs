using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.OrderDTOs
{
    public class CustomerOrderCreateDTO
    {
        // public Guid CustomerId { get; set; } Using User Id in claimtyes
        // public string Status { get; set; }  // WHEN CREATE AUTO IS PENDING STATUS
        public decimal TotalPrice { get; set; }
        public decimal ShippingPrice { get; set; }
        public decimal DepositPaid { get; set; }
        public DateTime OrderDate { get; set; }
    }
}
