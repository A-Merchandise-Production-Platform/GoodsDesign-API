using DataTransferObjects.AreaDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/areas")]
    [ApiController]
    public class AreasController : Controller
    {
        private readonly ILoggerService _logger;
        private readonly IAreaService _areaService;
        public AreasController(ILoggerService logger, IUserService userService)
        {
            _logger = logger;
        }

        // Create
        [HttpPost]
        public async Task<IActionResult> CreateArea([FromBody] AreaDTO areaDTO)
        {
            _logger.Info("Create area request received.");
            try
            {
                var createdArea = await _areaService.CreateArea(areaDTO);
                return Ok(ApiResult<AreaDTO>.Success(createdArea, "Area created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        // Update
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateArea(Guid id, [FromBody] AreaDTO areaDTO)
        {
            _logger.Info($"Update area with ID {id} request received.");
            try
            {
                var updatedArea = await _areaService.UpdateArea(id, areaDTO);
                return Ok(ApiResult<AreaDTO>.Success(updatedArea, "Area updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area update: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        // Delete
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteArea(Guid id)
        {
            _logger.Info($"Delete area with ID {id} request received.");
            try
            {
                var deletedArea = await _areaService.DeleteArea(id);
                return Ok(ApiResult<AreaDTO>.Success(deletedArea, "Area deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area deletion: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
