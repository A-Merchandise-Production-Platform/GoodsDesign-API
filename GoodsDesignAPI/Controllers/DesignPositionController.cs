using BusinessObjects.Entities;
using DataTransferObjects.DesignPositionDTOs;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesignPositionController : ControllerBase
    {
        private readonly IDesignPositionService _designPositionService;
        private readonly IClaimsService _claimsService;
        private readonly ILoggerService _logger;

        public DesignPositionController(
            IDesignPositionService designPositionService,
            IClaimsService claimsService,
            ILoggerService logger)
        {
            _designPositionService = designPositionService;
            _claimsService = claimsService;
            _logger = logger;
        }

        /// <summary>
        /// Overwrites or creates a <c>DesignPosition</c> record using composite keys.
        /// </summary>
        /// <remarks>
        /// If a record with the specified <c>ProductDesignId</c> and <c>ProductPositionTypeId</c> exists,
        /// it will be overwritten (upsert). Otherwise, a new record will be created.
        /// </remarks>
        /// <param name="dto">Contains the composite keys and the <c>DesignJSON</c> data.</param>
        /// <response code="200">Successfully overwritten or created the <c>DesignPosition</c>.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("overwrite-design")]
        public async Task<IActionResult> OverwriteDesign([FromBody] OverwriteDesignDTO dto)
        {
            try
            {
                var dp = await _designPositionService.OverwriteDesignAsync(
                    dto.ProductDesignId,
                    dto.ProductPositionTypeId,
                    dto.DesignJSON
                );

                return Ok(ApiResult<DesignPosition>.Success(dp, "Overwritten successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error overwriting design: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Adds a new <c>DesignPosition</c> record.
        /// </summary>
        /// <remarks>
        /// Creates a new <c>DesignPosition</c> in the database with the provided information.
        /// </remarks>
        /// <param name="dto">The data required to create a new <c>DesignPosition</c>.</param>
        /// <response code="200">The <c>DesignPosition</c> was added successfully.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        public async Task<IActionResult> AddDesignPosition([FromBody] AddDesignPositionDTO dto)
        {
            try
            {
                var designPosition = await _designPositionService.AddDesignPositionAsync(dto);
                return Ok(ApiResult<DesignPosition>.Success(designPosition, "DesignPosition added successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error adding DesignPosition: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"Error adding DesignPosition: {ex.Message}"));
            }
        }
    }
}
