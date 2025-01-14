using DataTransferObjects.OrderDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ICustomerOrderService
    {
        Task<CustomerOrderDTO> CheckoutOrder(Guid customerId);
        Task<List<CustomerOrderDTO>> GetOrdersByCustomerId(Guid customerId);
        Task<CustomerOrderDTO> UpdateOrderStatus(Guid orderId, string status);
    }
}
