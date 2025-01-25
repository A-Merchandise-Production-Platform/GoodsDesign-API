using Services.Services.ThirdPartyService.PaymentGateway.Types;

namespace Services.Services.ThirdPartyService.PaymentGateway.Interfaces
{
    public interface IPaymentService
    {
        Task<CreatePaymentResponse> CreatePayment(CreatePaymentRequest createPaymentRequest);
    }
}
