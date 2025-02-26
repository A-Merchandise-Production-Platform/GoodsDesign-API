using DataTransferObjects.ProductDesignDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/product-designs")]
    [ApiController]
    public class ProductDesignController : ControllerBase
    {
        private readonly IProductDesignService _productDesignService;

        public ProductDesignController(IProductDesignService productDesignService)
        {
            _productDesignService = productDesignService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductDesignCreateDTO dto)
        {
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
