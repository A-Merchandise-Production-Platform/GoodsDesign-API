using BusinessObjects.Entities;
using DataTransferObjects.ProductDesignDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/product-designs")]
    [ApiController]
    public class ProductDesignController : ControllerBase
    {
        private readonly IProductDesignService _productDesignService;
        private readonly ILoggerService _logger;

        public ProductDesignController(IProductDesignService productDesignService, ILoggerService logger)
        {
            _productDesignService = productDesignService;
            _logger = logger;
        }

        /// <summary>
        /// Creates a new <c>ProductDesign</c> record for the authenticated user.
        /// </summary>
        /// <remarks>
        /// The <c>UserId</c> is taken from the current authentication token.
        /// </remarks>
        /// <param name="dto">The data required to create a <c>ProductDesign</c>.</param>
        /// <response code="201">The <c>ProductDesign</c> was created successfully.</response>
        /// <response code="401">User is not authenticated.</response>
        /// <response code="400">Invalid request data.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductDesignCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.Warn("User ID not found in token.");
                return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
            }
            dto.UserId = Guid.Parse(userId);

            if (dto == null)
                return BadRequest("Invalid request data");

            var result = await _productDesignService.CreateProductDesign(dto);
            return CreatedAtAction(nameof(GetProductDesignById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Retrieves a <c>ProductDesign</c> by its unique identifier.
        /// </summary>
        /// <param name="id">The <c>GUID</c> of the <c>ProductDesign</c> to retrieve.</param>
        /// <response code="200">The <c>ProductDesign</c> was found and returned.</response>
        /// <response code="404">The <c>ProductDesign</c> was not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDesignById(Guid id)
        {
            var productDesign = await _productDesignService.GetById(id);
            if (productDesign == null) return NotFound();
            return Ok(productDesign);
        }

        /// <summary>
        /// Partially updates an existing <c>ProductDesign</c> by ID.
        /// </summary>
        /// <remarks>
        /// Only the fields provided in the request body will be updated.
        /// </remarks>
        /// <param name="id">The <c>GUID</c> of the <c>ProductDesign</c> to update.</param>
        /// <param name="dto">The fields to patch onto the <c>ProductDesign</c>.</param>
        /// <response code="200">The <c>ProductDesign</c> was patched successfully.</response>
        /// <response code="404">The <c>ProductDesign</c> was not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchProductDesign(Guid id, [FromBody] ProductDesignUpdateDTO dto)
        {
            try
            {
                var pd = await _productDesignService.PatchProductDesignAsync(id, dto);
                return Ok(ApiResult<ProductDesignDTO>.Success(pd, "Patched successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
