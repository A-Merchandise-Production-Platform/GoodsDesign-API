using DataTransferObjects.ProductDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.CartDTOs
{
    public class CartItemDTO
    {
       // public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public string? ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => Quantity * UnitPrice; // Tính tổng giá trị sản phẩm

        public virtual ProductDTO Product { get; set; }

    }
}
