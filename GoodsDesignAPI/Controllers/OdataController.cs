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
        /// Retrieves a list of users with OData support for filtering, sorting, paging, and more.
        /// </summary>
        [EnableQuery]
        [HttpGet("/api/users")]
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

        [EnableQuery]
        [HttpGet("/api/areas")]
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

        [EnableQuery]
        [HttpGet("/api/categories")]
        public async Task<ActionResult<IEnumerable<Area>>> GetCategories()
        {
            try
            {
                var result = await _context.Categories.ToListAsync();
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
        [HttpGet("/api/products")]
        public async Task<ActionResult<IEnumerable<Area>>> GetProducts()
        {
            try
            {
                var result = await _context.Products.ToListAsync();
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
