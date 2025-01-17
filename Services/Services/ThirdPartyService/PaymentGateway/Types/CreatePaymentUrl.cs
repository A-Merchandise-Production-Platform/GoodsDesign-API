using BusinessObjects.Enums;

namespace Services.Services.ThirdPartyService.PaymentGateway.Types
{
    public class CreatePaymentResponse
    {
        public string PaymentUrl { get; set; }
    }
    public class CreatePaymentRequest
    {
        public Guid PaymentId { get; set; }
        public string? ReturnUrl { get; set; } = "https://uydev.id.vn/payment";
        public string? PaymentMethod { get; set; } = PaymentGatewayEnum.VNPAY.ToString();
    }
}
