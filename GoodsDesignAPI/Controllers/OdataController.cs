using BusinessObjects;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces.CommonService;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    public class OdataController : Microsoft.AspNetCore.OData.Routing.Controllers.ODataController
    {
        private readonly GoodsDesignDbContext _context;
        private readonly ILoggerService _logger;
        private readonly UserManager<User> _userManager;

        public OdataController(GoodsDesignDbContext context, ILoggerService logger, UserManager<User> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        // 📌 1️⃣ USERS API
        [Authorize(Roles = "admin,manager")]
        [EnableQuery]
        [HttpGet("/api/users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                IQueryable<User> query = _context.Users.Include(x => x.Role);

                if (role == "admin") query = query.Where(u => u.Role.Name != "admin");
                else if (role == "manager") query = query.Where(u => u.Role.Name != "admin" && u.Role.Name != "manager");
                else return Forbid();

                return Ok(await query.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        [EnableQuery]
        [HttpGet("/api/users/{id}")]
        public async Task<ActionResult<User>> GetUserById(Guid id)
        {
            var user = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(u => u.Id == id);
            return user == null ? NotFound(ApiResult<object>.Error("User not found.")) : Ok(user);
        }

        // 📌 2️⃣ CATEGORIES API
        [EnableQuery]
        [HttpGet("/api/categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return Ok(await _context.Categories.Include(c => c.Products).ToListAsync());
        }

        [EnableQuery]
        [HttpGet("/api/categories/{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(Guid id)
        {
            var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
            return category == null ? NotFound(ApiResult<object>.Error("Category not found.")) : Ok(category);
        }

        // 📌 3️⃣ PRODUCTS API
        [EnableQuery]
        [HttpGet("/api/products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return Ok(await _context.Products.Include(p => p.Category).ToListAsync());
        }

        [EnableQuery]
        [HttpGet("/api/products/{id}")]
        public async Task<ActionResult<Product>> GetProductById(Guid id)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
            return product == null ? NotFound(ApiResult<object>.Error("Product not found.")) : Ok(product);
        }

        // 📌 4️⃣ FACTORIES API
        [EnableQuery]
        [HttpGet("/api/factories")]
        public async Task<ActionResult<IEnumerable<Factory>>> GetFactories()
        {
            return Ok(await _context.Factories.Include(f => f.FactoryProducts).ThenInclude(p => p.FactoryId).ToListAsync());
        }

        [EnableQuery]
        [HttpGet("/api/factories/{id}")]
        public async Task<ActionResult<Factory>> GetFactoryById(Guid id)
        {
            var factory = await _context.Factories.Include(f => f.FactoryProducts).FirstOrDefaultAsync(f => f.Id == id);
            return factory == null ? NotFound(ApiResult<object>.Error("Factory not found.")) : Ok(factory);
        }

        // 📌 5️⃣ CUSTOMER ORDERS API
        [EnableQuery]
        [HttpGet("/api/customer-orders")]
        public async Task<ActionResult<IEnumerable<CustomerOrder>>> GetCustomerOrders()
        {
            return Ok(await _context.CustomerOrders.Include(o => o.Customer).Include(o => o.CustomerOrderDetails).ToListAsync());
        }

        [EnableQuery]
        [HttpGet("/api/customer-orders/{id}")]
        public async Task<ActionResult<CustomerOrder>> GetCustomerOrderById(Guid id)
        {
            var order = await _context.CustomerOrders.Include(o => o.Customer).Include(o => o.CustomerOrderDetails).FirstOrDefaultAsync(o => o.Id == id);
            return order == null ? NotFound(ApiResult<object>.Error("Order not found.")) : Ok(order);
        }

        // 📌 6️⃣ CUSTOMER ORDER DETAILS API
        [EnableQuery]
        [HttpGet("/api/customer-order-details")]
        public async Task<ActionResult<IEnumerable<CustomerOrderDetail>>> GetCustomerOrderDetails()
        {
            return Ok(await _context.CustomerOrderDetails.Include(d => d.CustomerOrder).ToListAsync());
        }

        [EnableQuery]
        [HttpGet("/api/customer-order-details/{id}")]
        public async Task<ActionResult<CustomerOrderDetail>> GetCustomerOrderDetailById(Guid id)
        {
            var detail = await _context.CustomerOrderDetails.Include(d => d.CustomerOrder).FirstOrDefaultAsync(d => d.Id == id);
            return detail == null ? NotFound(ApiResult<object>.Error("Order detail not found.")) : Ok(detail);
        }

        // 📌 7️⃣ PAYMENTS API
        [EnableQuery]
        [HttpGet("/api/payments")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return Ok(await _context.Payments.Include(p => p.Customer).Include(p => p.CustomerOrder).ToListAsync());
        }

        [EnableQuery]
        [HttpGet("/api/payments/{id}")]
        public async Task<ActionResult<Payment>> GetPaymentById(Guid id)
        {
            var payment = await _context.Payments.Include(p => p.Customer).Include(p => p.CustomerOrder).FirstOrDefaultAsync(p => p.Id == id);
            return payment == null ? NotFound(ApiResult<object>.Error("Payment not found.")) : Ok(payment);
        }
    }
}
