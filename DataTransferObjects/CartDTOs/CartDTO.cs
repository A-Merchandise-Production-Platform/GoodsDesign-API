using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.CartDTOs
{
    public class CartDTO
    {
        public Guid UserId { get; set; }
        public List<CartItemDTO> Items { get; set; }
        public int TotalQuantity => Items.Sum(item => item.Quantity); // Tổng số lượng sản phẩm
        public decimal TotalPrice => Items.Sum(item => item.TotalPrice);
    }
}
