using BusinessObjects;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using Services.Interfaces.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;
using Services.Services.ThirdPartyService.PaymentGateway.Types;
using VNPAY.NET;
using VNPAY.NET.Enums;
using VNPAY.NET.Models;

namespace Services.Services.ThirdPartyService.PaymentGateway.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly GoodsDesignDbContext _context;
        private readonly ILoggerService _logger;
        private readonly IVnpay _vnPay;

        public VnPayService(ILoggerService logger, GoodsDesignDbContext context, IVnpay vnPay)
        {
            _logger = logger;
            _vnPay = vnPay;
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
                PaymentMethod = PaymentGatewayEnum.VNPAY.ToString(),
                Status = PaymentStatusEnum.PENDIMG.ToString(),
                TransactionLog = ""
            };

            //Add into DB
            await _context.PaymentTransactions.AddAsync(paymentTransaction);


            var request = new PaymentRequest
            {
                PaymentId = orderCode,
                Money = (int)payment.Amount,
                Description = "Thanh toán hóa đơn: " + orderCode,
                IpAddress = "SAMPLE_IP_ADDRESS",
                BankCode = BankCode.ANY, // Tùy chọn. Mặc định là tất cả phương thức giao dịch
                CreatedDate = DateTime.UtcNow.AddHours(7), // Tùy chọn. Mặc định là thời điểm hiện tại
                Currency = Currency.VND, // Tùy chọn. Mặc định là VND (Việt Nam đồng)
                Language = DisplayLanguage.Vietnamese // Tùy chọn. Mặc định là tiếng Việt
            };

            var paymentUrl = _vnPay.GetPaymentUrl(request);

            return new CreatePaymentResponse
            {
                PaymentUrl = paymentUrl
            };
        }
    }
}
