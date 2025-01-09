using DataTransferObjects.CartDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ICartItemService
    {
        Task<CartItemDTO> AddCartItem(CartItemDTO cartItemDTO);
        Task<bool> ClearUserCart(Guid userId);
        Task<CartDTO> GetCart();
        Task<CartDTO> GetCartByUserId(Guid userId);
        Task<bool> RemoveCartItem(Guid productId);
    }
}
