using DataTransferObjects.CartDTOs;
using DataTransferObjects.OrderDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/customer-orders")]
    [ApiController]
    public class CustomerOrderController : ControllerBase
    {
        private readonly ICustomerOrderService _orderService;
        private readonly ILoggerService _logger;

        public CustomerOrderController(ICustomerOrderService orderService, ILoggerService logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        /// <summary>
        /// Checkout to create a new order from the current user's cart.
        /// </summary>
        /// <returns>The newly created order.</returns>
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CheckoutDTO checkOutDTO)
        {
            _logger.Info("Checkout process initiated.");
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
                var order = await _orderService.CheckoutOrder(userId, checkOutDTO);
                return Ok(ApiResult<CustomerOrderDTO>.Success(order, "Order created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during checkout: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred during checkout."));
            }
        }

      
        

        /// <summary>
        /// Update the status of an order.
        /// </summary>
        /// <param name="orderId">The ID of the order to update.</param>
        /// <param name="status">The new status for the order.</param>
        /// <returns>The updated order.</returns>
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] string status)
        {
            _logger.Info($"Updating status for order ID: {id}");

            try
            {
                var updatedOrder = await _orderService.UpdateOrderStatus(id, status);
                return Ok(ApiResult<CustomerOrderDTO>.Success(updatedOrder, "Order status updated successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn($"Error updating order status: {ex.Message}");
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error updating order status: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while updating order status."));
            }
        }
    }
}
