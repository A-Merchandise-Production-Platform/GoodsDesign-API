using Net.payOS;
using Net.payOS.Types;
using Newtonsoft.Json;
using Repositories.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services.ThirdPartyService
{
    public class PayOSService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;
        private readonly PayOS _payOS;

        public PayOSService(ILoggerService logger, IUnitOfWork unitOfWork, PayOS payOS)
        {
            _logger = logger;
            _payOS = payOS;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateLinkResponse> CreateLink(CreateLinkRequest createLinkRequest)
        {
            //var domain = "https://uydev.id.vn/payment";

            //var paymentLinkRequest = new Net.payOS.Types.PaymentData(
            //    orderCode: txnRef,
            //    amount: depositMoney,
            //    description: "Nạp tiền: " + depositMoney,
            //    items: [new("Nạp tiền " + depositMoney, 1, depositMoney)],
            //    returnUrl: domain + "?success=true&transactionId=" + "GG" + "&amount=" + depositMoney,
            //    cancelUrl: domain + "?canceled=true&transactionId=" + "GG" + "&amount=" + depositMoney
            //);
            //var response = await _payOS.createPaymentLink(paymentLinkRequest);

            return new CreateLinkResponse
            {
                checkoutUrl = "https://sandbox.payos.asia/payment/checkout/5f9b4b7b-7b7b-4b7b-7b7b-7b7b7b7b7b7b"
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
        public Guid paymentId { get; set; }
    }

    public class CreateLinkResponse
    {
        public string checkoutUrl { get; set; }
    }
}
