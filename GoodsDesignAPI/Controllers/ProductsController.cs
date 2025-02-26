using BusinessObjects.Entities;
using DataTransferObjects.ProductDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : Controller
    {
        private readonly ILoggerService _logger;
        private readonly IProductService _productService;

        public ProductsController(ILoggerService logger, IProductService productService)
        {
            _logger = logger;
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDTO productDTO)
        {
            _logger.Info("Create product request received.");
            try
            {
                var createdProduct = await _productService.CreateProduct(productDTO);
                return Ok(ApiResult<Product>.Success(createdProduct, "Product created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during product creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductDTO productDTO)
        {
            _logger.Info($"Update product with ID {id} request received.");
            try
            {
                var updatedProduct = await _productService.UpdateProduct(id, productDTO);
                return Ok(ApiResult<Product>.Success(updatedProduct, "Product updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during product update: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            _logger.Info($"Delete product with ID {id} request received.");
            try
            {
                var deletedProduct = await _productService.DeleteProduct(id);
                return Ok(ApiResult<Product>.Success(deletedProduct, "Product deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during product deletion: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
