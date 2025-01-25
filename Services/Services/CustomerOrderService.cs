using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.OrderDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;

namespace Services.Services
{
    public class CustomerOrderService : ICustomerOrderService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;
        private readonly ICartItemService _cartItemService;
        private readonly IPaymentService _paymentService;

        public CustomerOrderService(IMapper mapper, IUnitOfWork unitOfWork, ILoggerService logger, ICartItemService cartItemService, IPaymentService paymentService)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _cartItemService = cartItemService;
            _paymentService = paymentService;
        }

        public async Task<CustomerOrderDTO> CheckoutOrder(Guid customerId)
        {
            try
            {
                _logger.Info($"Checkout order for customer ID: {customerId}");

                // Lấy thông tin giỏ hàng của người dùng
                var cart = await _cartItemService.GetCart(customerId);
                if (cart.Items == null || !cart.Items.Any())
                {
                    _logger.Warn("Cart is empty. Cannot proceed with checkout.");
                    throw new Exception("Cart is empty. Cannot proceed with checkout.");
                }

                // Tạo CustomerOrder từ giỏ hàng
                var order = new CustomerOrder
                {
                    CustomerId = customerId,
                    Status = "Pending",
                    TotalPrice = cart.Items.Sum(item => item.TotalPrice),
                    ShippingPrice = 0, // Bạn có thể thêm logic tính phí vận chuyển
                    DepositPaid = 0,   // Tạm để bằng 0, sẽ thêm logic khi cần
                    OrderDate = DateTime.UtcNow.AddHours(7),
                    CustomerOrderDetails = cart.Items.Select(item => new CustomerOrderDetail
                    {
                        //ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TotalPrice = item.TotalPrice,
                        Status = "PAID"
                    }).ToList()
                };

                // Lưu CustomerOrder vào cơ sở dữ liệu
                await _unitOfWork.CustomerOrderGenericRepository.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success($"Order created successfully for customer ID: {customerId}");

                // **Tạo Payments bằng phương thức mới trong PaymentService**

                //var payments = await _paymentService.GeneratePaymentsForOrder(order);
                //order.Payments = payments;
                var result = _mapper.Map<CustomerOrderDTO>(order);

                // Clear cart
                await _cartItemService.ClearUserCart(customerId);

                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during order creation: {ex.Message}");

                throw;
            }
        }

        public async Task<CustomerOrderDTO> UpdateOrderStatus(Guid orderId, string status)
        {
            _logger.Info($"Updating status for order ID: {orderId}");
            var order = await _unitOfWork.CustomerOrderGenericRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                _logger.Warn($"Order with ID: {orderId} not found.");
                throw new KeyNotFoundException($"Order with ID: {orderId} not found.");
            }

            order.Status = status;
            await _unitOfWork.CustomerOrderGenericRepository.Update(order);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"Order ID: {orderId} status updated to {status}");
            return _mapper.Map<CustomerOrderDTO>(order);
        }

        public async Task<List<CustomerOrderDTO>> GetOrdersByCustomerId(Guid customerId)
        {
            _logger.Info($"Fetching orders for customer ID: {customerId}");

            var orders = await _unitOfWork.CustomerOrderGenericRepository.GetAllAsync(
                o => o.CustomerId == customerId,
                o => o.CustomerOrderDetails
            );

            return _mapper.Map<List<CustomerOrderDTO>>(orders);
        }
    }
}
