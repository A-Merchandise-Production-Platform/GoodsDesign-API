using DataTransferObjects.ProductVarianceDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/product-variances")]
    [ApiController]
    public class ProductVariancesController : ControllerBase
    {
        private readonly IProductVarianceService _productVarianceService;
        private readonly ILoggerService _logger;

        public ProductVariancesController(IProductVarianceService productVarianceService, ILoggerService logger)
        {
            _productVarianceService = productVarianceService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductVariance([FromBody] ProductVarianceDTO productVarianceDTO)
        {
            _logger.Info("Request to create Product Variance received.");
            try
            {
                var result = await _productVarianceService.CreateProductVariance(productVarianceDTO);
                return Ok(ApiResult<object>.Success(result, "Product Variance created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during Product Variance creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProductVariance(Guid id, [FromBody] ProductVarianceDTO productVarianceDTO)
        {
            _logger.Info($"Request to update Product Variance with ID {id} received.");
            try
            {
                var result = await _productVarianceService.UpdateProductVariance(id, productVarianceDTO);
                return Ok(ApiResult<object>.Success(result, "Product Variance updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during Product Variance update: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProductVariance(Guid id)
        {
            _logger.Info($"Request to delete Product Variance with ID {id} received.");
            try
            {
                var result = await _productVarianceService.DeleteProductVariance(id);
                return Ok(ApiResult<object>.Success(result, "Product Variance deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during Product Variance deletion: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
