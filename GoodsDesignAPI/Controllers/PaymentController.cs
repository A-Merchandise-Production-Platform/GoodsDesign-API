using Microsoft.AspNetCore.Mvc;
using Services.Interfaces.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;
using Services.Services.ThirdPartyService.PaymentGateway.Types;
using Services.Utils;

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

        [ProducesResponseType(typeof(List<CreatePaymentResponse>), StatusCodes.Status200OK)]
        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest createPaymentRequest)
        {
            _logger.Info("Create payment request received.");
            try
            {
                var createdPayment = await _paymentService.CreatePayment(createPaymentRequest);
                return Ok(ApiResult<CreatePaymentResponse>.Success(createdPayment, "Payment created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during payment creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

    }
}
