using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/factories")]
    [ApiController]
    public class FactoriesController : ControllerBase
    {
        private readonly ILoggerService _logger;
        private readonly IFactoryService _factoryService;

        public FactoriesController(ILoggerService logger, IFactoryService factoryService)
        {
            _logger = logger;
            _factoryService = factoryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFactory([FromBody] FactoryDTO factoryDTO)
        {
            _logger.Info("Create factory request received.");
            try
            {
                var createdFactory = await _factoryService.CreateFactory(factoryDTO);
                return Ok(ApiResult<Factory>.Success(createdFactory, "Factory created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during factory creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateFactory(Guid id, [FromBody] FactoryDTO factoryDTO)
        {
            _logger.Info($"Update factory with ID {id} request received.");
            try
            {
                var updatedFactory = await _factoryService.UpdateFactory(id, factoryDTO);
                return Ok(ApiResult<Factory>.Success(updatedFactory, "Factory updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during factory update: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteFactory(Guid id)
        {
            _logger.Info($"Delete factory with ID {id} request received.");
            try
            {
                var deletedFactory = await _factoryService.DeleteFactory(id);
                return Ok(ApiResult<Factory>.Success(deletedFactory, "Factory deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during factory deletion: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
