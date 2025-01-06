using DataTransferObjects.BlankProductInStockDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/blank-products-in-stock")]
    [ApiController]
    public class BlankProductsInStockController : ControllerBase
    {
        private readonly IBlankProductInStockService _blankProductService;
        private readonly ILoggerService _logger;

        public BlankProductsInStockController(IBlankProductInStockService blankProductService, ILoggerService logger)
        {
            _blankProductService = blankProductService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBlankProduct([FromBody] BlankProductInStockDTO blankProductDTO)
        {
            _logger.Info("Create Blank Product In Stock request received.");
            try
            {
                var createdProduct = await _blankProductService.CreateBlankProductInStock(blankProductDTO);
                return Ok(ApiResult<object>.Success(createdProduct, "Blank Product In Stock created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateBlankProduct(Guid id, [FromBody] BlankProductInStockDTO blankProductDTO)
        {
            _logger.Info($"Update Blank Product In Stock request for ID {id} received.");
            try
            {
                var updatedProduct = await _blankProductService.UpdateBlankProductInStock(id, blankProductDTO);
                return Ok(ApiResult<object>.Success(updatedProduct, "Blank Product In Stock updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during update: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteBlankProduct(Guid id)
        {
            _logger.Info($"Delete Blank Product In Stock request for ID {id} received.");
            try
            {
                var deletedProduct = await _blankProductService.DeleteBlankProductInStock(id);
                return Ok(ApiResult<object>.Success(deletedProduct, "Blank Product In Stock deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during deletion: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBlankProductById(Guid id)
        {
            _logger.Info($"Fetch Blank Product In Stock with ID {id} request received.");
            try
            {
                var product = await _blankProductService.GetBlankProductInStockById(id);
                return Ok(ApiResult<object>.Success(product, "Blank Product In Stock fetched successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during fetch: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

     
    }
}
