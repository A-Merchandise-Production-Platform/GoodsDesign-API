using AutoMapper;
using BusinessObjects.Enums;
using Services.Interfaces.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;
using Services.Services.ThirdPartyService.PaymentGateway.Types;

namespace Services.Services.ThirdPartyService.PaymentGateway
{
    //Service chung để gọi các hàm VnPayService, PayOSService
    public class PaymentService : IPaymentService
    {
        // Tạo link truyền enum PaymentType[VnPay, PayOS] params: orderId, paymentType

        // IPN callback từ VnPay, PayOS
        //1. Webhook của PayOS (Gọi PayOS để update transaction)
        //2. IPN Receiver của VnPay (Gọi VnPay để update transaction)

        private readonly IMapper _mapper;
        private readonly ILoggerService _logger;
        private readonly IVnPayService _vnPayService;
        private readonly IPayOSService _payOSService;

        public PaymentService(IMapper mapper, ILoggerService logger, IVnPayService vnPayService, IPayOSService payOSService)
        {
            _mapper = mapper;
            _logger = logger;
            _vnPayService = vnPayService;
            _payOSService = payOSService;
        }

        public async Task<CreatePaymentResponse> CreatePayment(CreatePaymentRequest createPaymentRequest)
        {
            // String to enum conversion with validation
            if (!Enum.TryParse<PaymentGatewayEnum>(createPaymentRequest.PaymentMethod, true, out var paymentGatewayEnum))
            {
                throw new Exception("400 - PaymentMethod is invalid");
            }

            // Use switch to determine the appropriate payment gateway
            return paymentGatewayEnum switch
            {
                PaymentGatewayEnum.VNPAY => await _vnPayService.CreateLink(createPaymentRequest),
                PaymentGatewayEnum.PAYOS => await _payOSService.CreateLink(createPaymentRequest),
                _ => throw new Exception("400 - PaymentType is invalid"),
            };
        }

    }
}
