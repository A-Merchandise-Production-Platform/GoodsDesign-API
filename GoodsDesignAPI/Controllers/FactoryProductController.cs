using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/factory-products")]
    [ApiController]
    public class FactoryProductController : ControllerBase
    {
        private readonly ILoggerService _logger;
        private readonly IFactoryProductService _factoryProductService;

        public FactoryProductController(ILoggerService logger, IFactoryProductService factoryProductService)
        {
            _logger = logger;
            _factoryProductService = factoryProductService;
        }

        [HttpPost]
        public async Task<IActionResult> AddFactoryProduct([FromBody] FactoryProductDTO factoryProductDTO)
        {
            _logger.Info("Add FactoryProduct request received.");
            try
            {
                var addedFactoryProduct = await _factoryProductService.AddFactoryProduct(factoryProductDTO);
                return Ok(ApiResult<FactoryProduct>.Success(addedFactoryProduct, "FactoryProduct added successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during FactoryProduct addition: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
