using BusinessObjects;
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
        public async Task<ActionResult<IEnumerable<Area>>> GetProductPositionTypes()
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
