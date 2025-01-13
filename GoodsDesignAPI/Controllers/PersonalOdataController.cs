using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces.CommonService;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    [Authorize]
    public class PersonalOdataController : Microsoft.AspNetCore.OData.Routing.Controllers.ODataController
    {
        private readonly GoodsDesignDbContext _context;
        private readonly ILoggerService _logger;

        public PersonalOdataController(GoodsDesignDbContext context, ILoggerService logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves personal notifications for the current user.
        /// </summary>
        /// <response code="200">Returns the list of notifications for the current user.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/notifications/me")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetMyNotifications()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var userExists = await _context.Users.AnyAsync(u => u.Id == Guid.Parse(userId) && !u.IsDeleted);
                if (!userExists)
                {
                    _logger.Warn("User not found or deleted.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not found or deleted."));
                }

                var notifications = await _context.Notifications
                    .Where(n => n.UserId == Guid.Parse(userId))
                    .ToListAsync();

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error retrieving notifications: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Retrieves personal customer orders for the current user.
        /// </summary>
        /// <response code="200">Returns the list of customer orders for the current user.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/customer-orders/me")]
        public async Task<ActionResult<IEnumerable<CustomerOrder>>> GetMyCustomerOrders()
        {
            try
            {
                _logger.Info("Fetching orders for current user.");
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                if (!Guid.TryParse(userIdString, out var userId))
                {
                    _logger.Warn("Invalid User ID format.");
                    return BadRequest(ApiResult<object>.Error("400 - Invalid User ID format."));
                }

                var userExists = await _context.Users.AnyAsync(u => u.Id == userId && !u.IsDeleted);
                if (!userExists)
                {
                    _logger.Warn("User not found or deleted.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not found or deleted."));
                }

                var orders = await _context.CustomerOrders
                    .Where(o => o.CustomerId == userId)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error retrieving customer orders: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Retrieves personal factories owned by the current user.
        /// </summary>
        /// <response code="200">Returns the list of factories owned by the current user.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/factories/me")]
        public async Task<ActionResult<IEnumerable<Factory>>> GetMyFactories()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var userExists = await _context.Users.AnyAsync(u => u.Id == Guid.Parse(userId) && !u.IsDeleted);
                if (!userExists)
                {
                    _logger.Warn("User not found or deleted.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not found or deleted."));
                }

                var factories = await _context.Factories
                    .Where(f => f.FactoryOwnerId == Guid.Parse(userId))
                    .ToListAsync();

                return Ok(factories);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error retrieving factories: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Retrieves personal factories owned by the current user.
        /// </summary>
        /// <response code="200">Returns the list of factories owned by the current user.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/cart-items/me")]
        public async Task<ActionResult<CartItem>> GetMyCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var userExists = await _context.CartItems.AnyAsync(u => u.Id == Guid.Parse(userId) && !u.IsDeleted);
                if (!userExists)
                {
                    _logger.Warn("User not found or deleted.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not found or deleted."));
                }

                var factories = await _context.CartItems
                    .Where(f => f.UserId == Guid.Parse(userId))
                    .ToListAsync();

                return Ok(factories);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error retrieving factories: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }


    }
}
