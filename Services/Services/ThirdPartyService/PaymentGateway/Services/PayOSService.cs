using BusinessObjects;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using Microsoft.EntityFrameworkCore;
using Net.payOS;
using Net.payOS.Types;
using Newtonsoft.Json;
using Services.Interfaces.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;
using Services.Services.ThirdPartyService.PaymentGateway.Types;

namespace Services.Services.ThirdPartyService.PaymentGateway.Services
{
    public class PayOSService : IPayOSService
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

        public async Task<CreatePaymentResponse> CreateLink(CreatePaymentRequest createPaymentRequest)
        {
            if (createPaymentRequest.PaymentId == Guid.Empty)
            {
                throw new Exception("400 - PaymentId is required");
            }
            Payment payment = await _context.Payments.FindAsync(createPaymentRequest.PaymentId);

            if (payment == null)
            {
                throw new Exception("404 - Payment not found");
            }
            long orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            //Create payment transaction
            PaymentTransaction paymentTransaction = new PaymentTransaction
            {
                PaymentId = payment.Id,
                CustomerId = payment.CustomerId,
                PaymentGatewayTransactionId = orderCode,
                Amount = payment.Amount,
                Type = PaymentTransactionTypeEnum.PAY.ToString(),
                PaymentMethod = PaymentGatewayEnum.PAYOS.ToString(),
                Status = PaymentStatusEnum.PENDIMG.ToString(),
                TransactionLog = ""
            };

            //Add into DB
            await _context.PaymentTransactions.AddAsync(paymentTransaction);

            var paymentLinkRequest = new PaymentData(
                orderCode: orderCode,
                amount: (int)payment.Amount,
                description: "Thanh toán hóa đơn: " + orderCode,
                items: [new("Hóa đơn " + orderCode, 1, (int)payment.Amount)],
                returnUrl: createPaymentRequest.ReturnUrl + "?success=true&paymentId=" + orderCode + "&amount=" + (int)payment.Amount,
                cancelUrl: createPaymentRequest.ReturnUrl + "?canceled=true&paymentId=" + orderCode + "&amount=" + (int)payment.Amount
            );
            var response = await _payOS.createPaymentLink(paymentLinkRequest);

            return new CreatePaymentResponse
            {
                PaymentUrl = response.paymentLinkId
            };
        }

        public async Task<WebhookResponse> ReturnWebhook(WebhookType webhookType)
        {
            try
            {
                // Log the receipt of the webhook
                _logger.Info(JsonConvert.SerializeObject(webhookType));

                WebhookData verifiedData = _payOS.verifyPaymentWebhookData(webhookType); //xác thực data from webhook
                string responseCode = verifiedData.code;
                long orderCode = verifiedData.orderCode;

                PaymentTransaction paymentTransaction = await _context.PaymentTransactions.FirstOrDefaultAsync(x => x.PaymentGatewayTransactionId == orderCode);

                // Handle the webhook based on the transaction status
                switch (verifiedData.code)
                {
                    case "00":
                        // Update the transaction status
                        paymentTransaction.Status = PaymentTransactionStatusEnum.COMPLETED.ToString();
                        paymentTransaction.TransactionLog = "Payment processed successfully";
                        await _context.SaveChangesAsync();

                        return new WebhookResponse
                        {
                            Success = true,
                            Note = "Payment processed successfully"
                        };

                    case "01":
                        // Update the transaction status
                        paymentTransaction.Status = PaymentTransactionStatusEnum.FAILED.ToString();
                        paymentTransaction.TransactionLog = "Payment failed";

                        return new WebhookResponse
                        {
                            Success = false,
                            Note = "Invalid parameters"
                        };

                    default:
                        paymentTransaction.Status = PaymentTransactionStatusEnum.FAILED.ToString();
                        paymentTransaction.TransactionLog = "Unhandled code";

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
}
