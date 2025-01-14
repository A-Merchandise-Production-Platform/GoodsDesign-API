using BusinessObjects.Entities;
using DataTransferObjects.PaymentDTOs;

namespace Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentDTO> CreatePayment(PaymentCreateDTO paymentDTO, Guid customerId);
        Task<bool> DeletePayment(Guid paymentId);
        Task<List<Payment>> GeneratePaymentsForOrder(CustomerOrder order);
        Task<List<PaymentDTO>> GetPaymentsByCustomerId(Guid customerId);
        Task<PaymentDTO> UpdatePaymentStatus(Guid paymentId, string status);
    }
}
