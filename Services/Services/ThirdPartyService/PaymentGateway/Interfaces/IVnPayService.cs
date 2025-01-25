using Services.Services.ThirdPartyService.PaymentGateway.Types;

namespace Services.Services.ThirdPartyService.PaymentGateway.Interfaces
{
    public interface IVnPayService
    {
        public Task<CreatePaymentResponse> CreateLink(CreatePaymentRequest createPaymentRequest);
    }
}
