using DataTransferObjects.PaymentDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces.CommonService;
using Services.Interfaces;
using Services.Utils;
using System.Security.Claims;
using BusinessObjects.Enums;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILoggerService _logger;

        public PaymentController(IPaymentService paymentService, ILoggerService logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new payment for the current user.
        /// </summary>
        /// <param name="paymentDTO">The payment details.</param>
        /// <returns>The newly created payment.</returns>
        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentCreateDTO paymentDTO)
        {
            _logger.Info("Creating payment.");

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
                var payment = await _paymentService.CreatePayment(paymentDTO, userId);
                return Ok(ApiResult<PaymentDTO>.Success(payment, "Payment created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error creating payment: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while creating the payment."));
            }
        }

        //Get my paments already in PersonalOdataController

        /// <summary>
        /// Update the status of a payment.
        /// </summary>
        /// <param name="id">The ID of the payment to update.</param>
        /// <param name="status">The new status of the payment.</param>
        /// <returns>The updated payment.</returns>
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdatePaymentStatus(Guid id, [FromBody] PaymentStatusEnum status)
        {
            _logger.Info($"Updating payment status for payment ID: {id}");

            try
            {
                var updatedPayment = await _paymentService.UpdatePaymentStatus(id, status.ToString());
                return Ok(ApiResult<PaymentDTO>.Success(updatedPayment, "Payment status updated successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn($"Error updating payment status: {ex.Message}");
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error updating payment status: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while updating payment status."));
            }
        }

        /// <summary>
        /// Delete a payment.
        /// </summary>
        /// <param name="id">The ID of the payment to delete.</param>
        /// <returns>True if the payment was deleted successfully.</returns>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeletePayment(Guid id)
        {
            _logger.Info($"Deleting payment with ID: {id}");

            try
            {
                var result = await _paymentService.DeletePayment(id);
                return Ok(ApiResult<bool>.Success(result, "Payment deleted successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn($"Error deleting payment: {ex.Message}");
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error deleting payment: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred while deleting the payment."));
            }
        }
    }
}
