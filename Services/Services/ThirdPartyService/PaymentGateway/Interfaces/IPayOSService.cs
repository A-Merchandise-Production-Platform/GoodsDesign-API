using Net.payOS.Types;
using Services.Services.ThirdPartyService.PaymentGateway.Services;
using Services.Services.ThirdPartyService.PaymentGateway.Types;

namespace Services.Services.ThirdPartyService.PaymentGateway.Interfaces
{
    public interface IPayOSService
    {
        public Task<CreatePaymentResponse> CreateLink(CreatePaymentRequest createPaymentRequest);
        public Task<WebhookResponse> ReturnWebhook(WebhookType webhookType);
    }
}
