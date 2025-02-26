using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.CartDTOs
{
    public class CheckoutDTO
    {
        public decimal TotalShippingPrice { get; set; }
        public string? Note { get; set; } = "";
    }
}
