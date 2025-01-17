using BusinessObjects;
using BusinessObjects.Entities;
using Net.payOS;
using Net.payOS.Types;
using Newtonsoft.Json;
using Services.Interfaces.CommonService;

namespace Services.Services.ThirdPartyService
{
    public class PayOSService
    {
        private readonly GoodsDesignDbContext _context;
        private readonly ILoggerService _logger;
        private readonly PayOS _payOS;

        public PayOSService(ILoggerService logger, GoodsDesignDbContext context, PayOS payOS)
        {
            _logger = logger;
            _payOS = payOS;
            _context = context;
        }

        public async Task<CreateLinkResponse> CreateLink(CreateLinkRequest createLinkRequest)
        {
            if (createLinkRequest.PaymentId == Guid.Empty)
            {
                throw new Exception("400 - PaymentId is required");
            }
            Payment payment = await _context.Payments.FindAsync(createLinkRequest.PaymentId);

            if (payment == null)
            {
                throw new Exception("404 - Payment not found");
            }

            var paymentLinkRequest = new PaymentData(
                orderCode: payment.OrderCode,
                amount: (int)payment.Amount,
                description: "Thanh toán hóa đơn: " + payment.OrderCode,
                items: [new("Hóa đơn " + payment.OrderCode, 1, (int)payment.Amount)],
                returnUrl: createLinkRequest.ReturnUrl + "?success=true&paymentId=" + payment.OrderCode + "&amount=" + (int)payment.Amount,
                cancelUrl: createLinkRequest.ReturnUrl + "?canceled=true&paymentId=" + payment.OrderCode + "&amount=" + (int)payment.Amount
            );
            var response = await _payOS.createPaymentLink(paymentLinkRequest);

            return new CreateLinkResponse
            {
                CheckoutUrl = response.paymentLinkId
            };
        }

        public async Task<WebhookResponse> ReturnWebhook(WebhookType webhookType)
        {
            try
            {
                // Log the receipt of the webhook
                //Seriablize the object to log
                _logger.Info(JsonConvert.SerializeObject(webhookType));

                WebhookData verifiedData = _payOS.verifyPaymentWebhookData(webhookType); //xác thực data from webhook
                string responseCode = verifiedData.code;

                string orderCode = verifiedData.orderCode.ToString();

                string transactionId = "TRANS" + orderCode;

                //var transaction = await _unitOfWork.TransactionRepository.GetByIdAsync(int.Parse(webhookType.data.orderCode.ToString()));

                // Handle the webhook based on the transaction status
                switch (verifiedData.code)
                {
                    case "00":
                        // Update the transaction status
                        //await UpdateStatusTransaction(transaction);

                        return new WebhookResponse
                        {
                            Success = true,
                            Note = "Payment processed successfully"
                        };

                    case "01":
                        // Update the transaction status
                        //await UpdateErrorTransaction(transaction, "Payment failed");

                        return new WebhookResponse
                        {
                            Success = false,
                            Note = "Invalid parameters"
                        };

                    default:
                        return new WebhookResponse
                        {
                            Success = false,
                            Note = "Unhandled code"
                        };
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message);
                throw ex;
            }
        }

    }
    public class WebhookResponse
    {
        public bool Success { get; set; }
        public string Note { get; set; }
    }

    public class CreateLinkRequest
    {
        public Guid PaymentId { get; set; }
        public string? ReturnUrl { get; set; } = "https://uydev.id.vn/payment";
    }

    public class CreateLinkResponse
    {
        public string CheckoutUrl { get; set; }
    }
}
