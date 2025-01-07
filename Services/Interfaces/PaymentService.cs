namespace Services.Interfaces
{
    //Service chung để gọi các hàm VnPayService, PayOSService
    public class PaymentService : IPaymentService
    {
        // Tạo link truyền enum PaymentType[VnPay, PayOS] params: orderId, paymentType

        // IPN callback từ VnPay, PayOS
        //1. Webhook của PayOS (Gọi PayOS để update transaction)
        //2. IPN Receiver của VnPay (Gọi VnPay để update transaction)
    }
}
