using BusinessObjects.Entities;
using DataTransferObjects.ProductDesignDTOs;
using DataTransferObjects.ProductDTOs;
using DataTransferObjects.UserDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.CartDTOs
{
    public class CartItemDTO
    {
        public Guid UserId { get; set; }
        public UserDTO User { get; set; }

        public Guid ProductDesignId { get; set; }
        public int Quantity { get; set; }
       // public string? ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => Quantity * UnitPrice; // Tính tổng giá trị sản phẩm

        public virtual ProductDesignDTO ProductDesign { get; set; }

    }
}
