using DataTransferObjects.ProductPositionTypeDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Services;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/product-position-types")]
    [ApiController]
    public class ProductPositionTypesController : ControllerBase
    {
        private readonly IProductPositionTypeService _service;
        private readonly ILoggerService _logger;

        public ProductPositionTypesController(IProductPositionTypeService service, ILoggerService logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductPositionTypeDTO dto)
        {
            _logger.Info("Create ProductPositionType request received.");
            try
            {
                var created = await _service.CreateProductPositionType(dto);
                return Ok(ApiResult<object>.Success(created, "ProductPositionType created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during creation: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductPositionTypeDTO dto)
        {
            _logger.Info($"Update ProductPositionType with ID {id} request received.");
            try
            {
                var updated = await _service.UpdateProductPositionType(id, dto);
                return Ok(ApiResult<object>.Success(updated, "ProductPositionType updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during update: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            _logger.Info($"Delete ProductPositionType with ID {id} request received.");
            try
            {
                var deleted = await _service.DeleteProductPositionType(id);
                return Ok(ApiResult<object>.Success(deleted, "ProductPositionType deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during deletion: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetProductPositionTypeById(id);
            return Ok(ApiResult<object>.Success(result, "ProductPositionType fetched successfully."));
        }
    }
}
