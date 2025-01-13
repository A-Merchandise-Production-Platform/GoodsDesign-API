using DataTransferObjects.CartDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces.CommonService;
using Services.Interfaces;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartItemService _cartItemService;
        private readonly ILoggerService _logger;

        public CartController(ICartItemService cartItemService, ILoggerService logger)
        {
            _cartItemService = cartItemService;
            _logger = logger;
        }

        /// <summary>
        /// Get the current user's cart.
        /// </summary>
        /// <returns>The cart containing all cart items and the total price/quantity.</returns>
        [HttpGet("me/cart")]
        public async Task<IActionResult> GetCart()
        {
            _logger.Info("Fetching cart for current user.");
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var cart = await _cartItemService.GetCart(Guid.Parse(userId));
                return Ok(ApiResult<CartDTO>.Success(cart, "Cart retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching cart: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while retrieving the cart."));
            }
        }

        /// <summary>
        /// Add a new item to the cart.
        /// </summary>
        /// <param name="cartItemDTO">The cart item to be added.</param>
        /// <returns>The updated cart item.</returns>
        [HttpPost("me/cart-items")]
        public async Task<IActionResult> AddCartItem([FromBody] CartItemCreateDTO cartItemDTO)
        {
            _logger.Info("Adding item to cart.");
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }
                var updatedCartItem = await _cartItemService.AddCartItem(cartItemDTO, Guid.Parse(userId));
                return Ok(ApiResult<CartItemDTO>.Success(updatedCartItem, "Cart item added successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn($"Error adding item to cart: {ex.Message}");
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error adding item to cart: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while adding the item to the cart."));
            }
        }

        /// <summary>
        /// Remove an item from the cart by product ID.
        /// </summary>
        /// <param name="productId">The ID of the product to be removed.</param>
        /// <returns>True if the item was successfully removed.</returns>
        [HttpDelete("me/cart-items/{productId:guid}")]
        public async Task<IActionResult> RemoveCartItem(Guid productId)
        {

            _logger.Info($"Removing cart item with ProductId {productId}.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.Warn("User ID not found in token.");
                return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
            }
            try
            {
                var result = await _cartItemService.RemoveCartItem(productId);
                return Ok(ApiResult<bool>.Success(result, "Cart item removed successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn($"Error removing cart item: {ex.Message}");
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error removing cart item: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while removing the cart item."));
            }
        }

        /// <summary>
        /// Clear the current user's cart.
        /// </summary>
        /// <returns>True if the cart was successfully cleared.</returns>
        [HttpDelete("me/cart/clear")]
        public async Task<IActionResult> ClearCart()
        {
            _logger.Info("Clearing cart for current user.");

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                _logger.Warn("User ID not found in token.");
                return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
            }

            if (!Guid.TryParse(userIdString, out var userId))
            {
                _logger.Warn("Invalid User ID format.");
                return BadRequest(ApiResult<object>.Error("400 - Invalid User ID format."));
            }

            try
            {
                var result = await _cartItemService.ClearUserCart(userId);
                if (result)
                {
                    return Ok(ApiResult<bool>.Success(result, "Cart cleared successfully."));
                }

                return BadRequest(ApiResult<object>.Error("Failed to clear the cart."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error clearing cart: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while clearing the cart."));
            }
        }

        /// <summary>
        /// Get the cart for a specific user by user ID (admin or manager only).
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <returns>The cart for the specified user.</returns>
        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetCartByUserId(Guid userId)
        {
            _logger.Info($"Fetching cart for user ID {userId}.");



            try
            {
                var cart = await _cartItemService.GetCartByUserId(userId);
                return Ok(ApiResult<CartDTO>.Success(cart, "Cart retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching cart for user ID {userId}: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while retrieving the cart."));
            }
        }

    }
}
