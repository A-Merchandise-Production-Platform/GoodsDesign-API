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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDesignById(Guid id)
        {
            var productDesign = await _productDesignService.GetById(id);
            if (productDesign == null) return NotFound();
            return Ok(productDesign);
        }
    }
}
