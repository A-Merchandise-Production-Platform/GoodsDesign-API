﻿using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    public class OdataController : Microsoft.AspNetCore.OData.Routing.Controllers.ODataController
    {
        private readonly GoodsDesignDbContext _context;
        private readonly ILoggerService _logger;

        public OdataController(GoodsDesignDbContext context, ILoggerService logger)
        {
            _context = context;
            _logger = logger;
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
        /// Retrieves a list of areas with OData support.
        /// </summary>
        /// <response code="200">Returns the list of areas.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/areas")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<Area>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<Area>>> GetAreas()
        {
            try
            {
                var result = await _context.Areas.ToListAsync();
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
                var result = await _context.Notifications.Include(x => x.User).ToListAsync();
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
                var result = await _context.Factories.Include(x => x.FactoryProducts).ThenInclude(x => x.Product).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        [EnableQuery]
        [HttpGet("/api/product-variances")]
        public async Task<ActionResult<IEnumerable<ProductVariance>>> GetProductVariances()
        {
            try
            {
                var result = await _context.ProductVariances.Include(x => x.Product).ToListAsync();
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
        /// Retrieves a list of blank products in stock with their associated product variances.
        /// </summary>
        /// <response code="200">Returns the list of blank products in stock with product variances.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/blank-products-in-stock")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<BlankProductInStock>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<BlankProductInStock>>> GetBlankProductsInStock()
        {
            try
            {
                var result = await _context.BlankProductsInStock.Include(x => x.ProductVariance).ToListAsync();
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
        /// Retrieves a list of product position types with their associated products.
        /// </summary>
        /// <response code="200">Returns the list of product position types with products.</response>
        /// <response code="500">Internal server error.</response>
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
        /// Retrieves a blank product in stock by ID.
        /// </summary>
        /// <param name="id">The ID of the blank product in stock.</param>
        /// <response code="200">Returns the blank product in stock details.</response>
        /// <response code="404">Blank product in stock not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/blank-products-in-stock/{id}")]
        public async Task<ActionResult<BlankProductInStock>> GetBlankProductInStockById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.BlankProductsInStock.Include(x => x.ProductVariance).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Blank product in stock with ID '{id}' not found."));
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



    }
}
