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



        /// <summary>
        /// Retrieves a list of users with OData support based on the current user's role.
        /// </summary>
        /// <remarks>
        /// Admin: Retrieves all users except those with the Admin role.
        /// Manager: Retrieves all users except those with the Admin and Manager roles.
        /// Supports OData features such as filtering, sorting, and paging.
        /// </remarks>
        /// <response code="200">Returns the list of users.</response>
        /// <response code="403">Forbidden for unauthorized roles.</response>
        /// <response code="500">Internal server error.</response>
        [Authorize(Roles = "admin,manager")]
        [EnableQuery]
        [HttpGet("/api/users")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<User>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                // Lấy role của user hiện tại
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (currentUserRole == null)
                {
                    _logger.Warn("User role not found.");
                    return StatusCode(403, ApiResult<object>.Error("403 - Forbidden: User role is missing."));
                }

                IQueryable<User> query = _context.Users.Include(x => x.Role);

                // Lọc dựa trên vai trò hiện tại
                if (currentUserRole == "admin")
                {
                    query = query.Where(u => u.Role.Name != "admin");
                }
                else if (currentUserRole == "manager")
                {
                    query = query.Where(u => u.Role.Name != "admin" && u.Role.Name != "manager");
                }
                else
                {
                    _logger.Warn($"Access denied for role: {currentUserRole}");
                    return StatusCode(403, ApiResult<object>.Error("403 - Forbidden: Access denied."));
                }
                _logger.Success($"User list retrieved successfully by {currentUserRole}.");

                var users = await query.ToListAsync();



                return Ok(users);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a user by ID.
        /// </summary>
        /// <param name="id">The ID of the user.</param>
        /// <response code="200">Returns the user details.</response>
        /// <response code="404">User not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/users/{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"User with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }


        /// <summary>
        /// Retrieves a list of categories with their associated products using OData support.
        /// </summary>
        /// <response code="200">Returns the list of categories with products.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/categories")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Category>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            try
            {
                var result = await _context.Categories.Include(x => x.Products).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a category by ID.
        /// </summary>
        /// <param name="id">The ID of the category.</param>
        /// <response code="200">Returns the category details.</response>
        /// <response code="404">Category not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/categories/{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Categories.Include(x => x.Products).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Category with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of notifications with associated user information.
        /// </summary>
        /// <response code="200">Returns the list of notifications with users.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/notifications")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Notification>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    throw new UnauthorizedAccessException("401 - User not authenticated.");
                }

                var userExists = await _userManager.FindByIdAsync(userId);

                if (userExists == null)
                {
                    _logger.Warn("User not found or deleted.");
                    throw new UnauthorizedAccessException("401 - User not found or deleted.");
                }

                var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == userExists.RoleId);

                if (role == null)
                {
                    _logger.Warn("User role not found.");
                    throw new UnauthorizedAccessException("401 - User role not found.");
                }
                var result = await _context.Notifications
                    .Where(n => n.Type == NotificationType.AllUsers
                                || n.UserId == userExists.Id
                                || n.Role.ToLower() == role.Name.ToLower())
                    .OrderByDescending(n => n.CreatedAt)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a notification by ID.
        /// </summary>
        /// <param name="id">The ID of the notification.</param>
        /// <response code="200">Returns the notification details.</response>
        /// <response code="404">Notification not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/notifications/{id}")]
        public async Task<ActionResult<Notification>> GetNotificationById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Notifications.Include(x => x.User).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Notification with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of products with associated categories using OData support.
        /// </summary>
        /// <response code="200">Returns the list of products with categories.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/products")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Product>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                var result = await _context.Products.Include(x => x.Category).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a product by ID.
        /// </summary>
        /// <param name="id">The ID of the product.</param>
        /// <response code="200">Returns the product details.</response>
        /// <response code="404">Product not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/products/{id}")]
        public async Task<ActionResult<Product>> GetProductById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Products.Include(x => x.Category).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Product with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of factories with their associated products using OData support.
        /// </summary>
        /// <response code="200">Returns the list of factories with products.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/factories")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Factory>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<Factory>>> GetFactories()
        {
            try
            {
                var result = await _context.Factories.Include(x => x.FactoryProducts).ThenInclude(x => x.BlankVariance).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a factory by ID.
        /// </summary>
        /// <param name="id">The ID of the factory.</param>
        /// <response code="200">Returns the factory details.</response>
        /// <response code="404">Factory not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/factories/{id}")]
        public async Task<ActionResult<Factory>> GetFactoryById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Factories.Include(x => x.FactoryProducts).ThenInclude(x => x.BlankVariance).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Factory with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of blank variance with their associated products using OData support.
        /// </summary>
        /// <response code="200">Returns the list of blank variance with products.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/blank-variances")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Factory>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<BlankVariance>>> GetBlankVariances()
        {
            try
            {
                var result = await _context.BlankVariances.Include(x => x.Product).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a blank variance by ID.
        /// </summary>
        /// <param name="id">The ID of the product variance.</param>
        /// <response code="200">Returns the product variance details.</response>
        /// <response code="404">Product variance not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/blank-variances/{id}")]
        public async Task<ActionResult<BlankVariance>> GetProductVarianceById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.BlankVariances.Include(x => x.Product).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Product variance with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }



        [EnableQuery]
        [HttpGet("/api/product-position-types")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<ProductPositionType>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<ProductPositionType>>> GetProductPositionTypes()
        {
            try
            {
                var result = await _context.ProductPositionTypes.Include(x => x.Product).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a product position type by ID.
        /// </summary>
        /// <param name="id">The ID of the product position type.</param>
        /// <response code="200">Returns the product position type details.</response>
        /// <response code="404">Product position type not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/product-position-types/{id}")]
        public async Task<ActionResult<ProductPositionType>> GetProductPositionTypeById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.ProductPositionTypes.Include(x => x.Product).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Product position type with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }




        /// <summary>
        /// Retrieves a list of customer orders with associated details and customers.
        /// </summary>
        /// <response code="200">Returns the list of customer orders with details.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/customer-orders")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<CustomerOrder>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<CustomerOrder>>> GetCustomerOrders()
        {
            try
            {
                var result = await _context.CustomerOrders
                   // .Include(o => o.Customer)
                    //.Include(o => o.CustomerOrderDetails)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a customer order by ID.
        /// </summary>
        /// <param name="id">The ID of the customer order.</param>
        /// <response code="200">Returns the customer order details.</response>
        /// <response code="404">Customer order not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/customer-orders/{id}")]
        public async Task<ActionResult<CustomerOrder>> GetCustomerOrderById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.CustomerOrders
                    .Include(o => o.Customer)
                    .Include(o => o.CustomerOrderDetails)
                    .FirstOrDefaultAsync(o => o.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Customer order with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of customer order details with associated orders.
        /// </summary>
        /// <response code="200">Returns the list of customer order details.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/customer-order-details")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<CustomerOrderDetail>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<CustomerOrderDetail>>> GetCustomerOrderDetails()
        {
            try
            {
                var result = await _context.CustomerOrderDetails
                    .Include(d => d.CustomerOrder)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a customer order detail by ID.
        /// </summary>
        /// <param name="id">The ID of the customer order detail.</param>
        /// <response code="200">Returns the customer order detail.</response>
        /// <response code="404">Customer order detail not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/customer-order-details/{id}")]
        public async Task<ActionResult<CustomerOrderDetail>> GetCustomerOrderDetailById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.CustomerOrderDetails
                    .Include(d => d.CustomerOrder)
                    .FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Customer order detail with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of payments with associated orders and customers.
        /// </summary>
        /// <response code="200">Returns the list of payments.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/payments")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Payment>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            try
            {
                var result = await _context.Payments
                    .Include(p => p.Customer)
                    .Include(p => p.CustomerOrder)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a payment by ID.
        /// </summary>
        /// <param name="id">The ID of the payment.</param>
        /// <response code="200">Returns the payment details.</response>
        /// <response code="404">Payment not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/payments/{id}")]
        public async Task<ActionResult<Payment>> GetPaymentById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Payments
                    .Include(p => p.Customer)
                    .Include(p => p.CustomerOrder)
                    .FirstOrDefaultAsync(p => p.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Payment with ID '{id}' not found."));
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of product designs with associated user.
        /// </summary>
        /// <response code="200">Returns the list of product designs.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/product-designs")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<ProductDesign>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<ProductDesign>>> GetProductDesigns()
        {
            try
            {
                var result = await _context.ProductDesigns
                    //.Include(p => p.User).Include(x=>x.BlankVariance)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Retrieves a list of staff assigned with factory
        /// </summary>
        /// <response code="200">Returns the list of assgined staff.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/staff-factories")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<StaffFactory>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<StaffFactory>>> GetStaffFactory()
        {
            try
            {
                var result = await _context.StaffFactories
                    .Include(p => p.FactoryOwner)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }




    }
}