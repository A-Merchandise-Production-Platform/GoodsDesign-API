using AutoMapper;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.PaymentDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;

namespace Services.Services
{
    //Service chung để gọi các hàm VnPayService, PayOSService
    public class PaymentEntityService 
    {
        // Tạo link truyền enum PaymentType[VnPay, PayOS] params: orderId, paymentType

        // IPN callback từ VnPay, PayOS
        //1. Webhook của PayOS (Gọi PayOS để update transaction)
        //2. IPN Receiver của VnPay (Gọi VnPay để update transaction)

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;

        public PaymentEntityService(IMapper mapper, IUnitOfWork unitOfWork, ILoggerService logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }


        public async Task<PaymentDTO> CreatePayment(PaymentCreateDTO paymentDTO, Guid customerId)
        {
            _logger.Info($"Creating payment for customer ID: {customerId}");

            var order = await _unitOfWork.CustomerOrderGenericRepository.GetByIdAsync(paymentDTO.CustomerOrderId);
            if (order == null)
            {
                _logger.Warn($"CustomerOrder with ID: {paymentDTO.CustomerOrderId} not found.");
                throw new KeyNotFoundException($"CustomerOrder with ID: {paymentDTO.CustomerOrderId} not found.");
            }

            var payment = new Payment
            {
                CustomerOrderId = paymentDTO.CustomerOrderId,
                CustomerId = customerId,
                Amount = paymentDTO.Amount,
                Type = paymentDTO.Type,
                PaymentLog = paymentDTO.PaymentLog,
                Status = PaymentStatusEnum.PENDIMG.ToString(),
                CreatedDate = DateTime.UtcNow.AddHours(7)
            };

            var result = await _unitOfWork.PaymentGenericRepository.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"Payment created successfully for customer ID: {customerId}");
            return _mapper.Map<PaymentDTO>(result);
        }

        public async Task<List<Payment>> GeneratePaymentsForOrder(CustomerOrder order)
        {
            if (order == null)
            {
                _logger.Warn("Order cannot be null while generating payments.");
                throw new ArgumentNullException(nameof(order), "Order cannot be null.");
            }

            _logger.Info($"Generating payments for Order ID: {order.Id}");

            // Tính toán tiền cọc và phần còn lại
            var depositAmount = Math.Ceiling(order.TotalPrice * 0.3m); // 30% và làm tròn lên
            var remainingAmount = order.TotalPrice - depositAmount; // 70% còn lại

            // Tạo danh sách payments
            var payments = new List<Payment>
        {
            new Payment
            {
                CustomerOrderId = order.Id,
                CustomerId = order.CustomerId,
                Amount = depositAmount,
                Type = "Deposit",
                PaymentLog = "First Payment - Deposit",
                Status = "Pending",
                CreatedDate = DateTime.UtcNow.AddHours(7)
            },
            new Payment
            {
                CustomerOrderId = order.Id,
                CustomerId = order.CustomerId,
                Amount = remainingAmount,
                Type = "Balance",
                PaymentLog = "Second Payment - Balance",
                Status = "Pending",
                CreatedDate = DateTime.UtcNow.AddHours(7)
            }
        };

            // Lưu payments vào database
            await _unitOfWork.PaymentGenericRepository.AddRangeAsync(payments);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"Payments generated successfully for Order ID: {order.Id}");

            return payments;
        }

        public async Task<List<PaymentDTO>> GetPaymentsByCustomerId(Guid customerId)
        {
            _logger.Info($"Fetching payments for customer ID: {customerId}");

            var payments = await _unitOfWork.PaymentGenericRepository.GetAllAsync(
                p => p.CustomerId == customerId,
                p => p.CustomerOrder
            );

            return _mapper.Map<List<PaymentDTO>>(payments);
        }

        public async Task<PaymentDTO> UpdatePaymentStatus(Guid paymentId, string status)
        {
            _logger.Info($"Updating payment status for payment ID: {paymentId}");

            var payment = await _unitOfWork.PaymentGenericRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                _logger.Warn($"Payment with ID: {paymentId} not found.");
                throw new KeyNotFoundException($"Payment with ID: {paymentId} not found.");
            }

            payment.Status = status;
            await _unitOfWork.PaymentGenericRepository.Update(payment);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"Payment ID: {paymentId} status updated to {status}");
            return _mapper.Map<PaymentDTO>(payment);
        }

        public async Task<bool> DeletePayment(Guid paymentId)
        {
            _logger.Info($"Deleting payment with ID: {paymentId}");

            var payment = await _unitOfWork.PaymentGenericRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                _logger.Warn($"Payment with ID: {paymentId} not found.");
                throw new KeyNotFoundException($"Payment with ID: {paymentId} not found.");
            }

            await _unitOfWork.PaymentGenericRepository.SoftRemove(payment);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"Payment with ID: {paymentId} deleted successfully.");
            return true;
        }
    }
}