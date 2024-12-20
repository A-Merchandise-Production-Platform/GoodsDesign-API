﻿using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    public class OdataController : Microsoft.AspNetCore.OData.Routing.Controllers.ODataController
    {
        private readonly GoodsDesignDbContext _context;

        public OdataController(GoodsDesignDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of users with OData support.
        /// </summary>
        /// <remarks>
        /// Supports OData features such as filtering, sorting, and paging.
        /// </remarks>
        /// <response code="200">Returns the list of users.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/users")]
        [ProducesResponseType(typeof(ApiResult<IEnumerable<User>>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var users = await _context.Users.Include(x => x.Role).ToListAsync();
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
        /// Retrieves an area by ID.
        /// </summary>
        /// <param name="id">The ID of the area.</param>
        /// <response code="200">Returns the area details.</response>
        /// <response code="404">Area not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/areas/{id}")]
        public async Task<ActionResult<Area>> GetAreaById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.Areas.FirstOrDefaultAsync(d => d.Id.Equals(itemId));

                if (item == null)
                {
                    return NotFound(ApiResult<object>.Error($"Area with ID '{id}' not found."));
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
                var item = await _context.Factories.Include(x => x.FactoryProducts).ThenInclude(x => x.Product).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

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

        [EnableQuery]
        [HttpGet("/api/product-variances")]
        public async Task<ActionResult<IEnumerable<Area>>> GetProductVariances()
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
        /// Retrieves a product variance by ID.
        /// </summary>
        /// <param name="id">The ID of the product variance.</param>
        /// <response code="200">Returns the product variance details.</response>
        /// <response code="404">Product variance not found.</response>
        /// <response code="500">Internal server error.</response>
        [EnableQuery]
        [HttpGet("/api/product-variances/{id}")]
        public async Task<ActionResult<ProductVariance>> GetProductVarianceById(string id)
        {
            try
            {
                var itemId = Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
                var item = await _context.ProductVariances.Include(x => x.Product).FirstOrDefaultAsync(d => d.Id.Equals(itemId));

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
        [HttpGet("/api/blank-products-in-stock")]
        public async Task<ActionResult<IEnumerable<Area>>> GetBlankProductsInStock()
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

        [EnableQuery]
        [HttpGet("/api/product-position-types")]
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

    }
}
