using BusinessObjects.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces.CommonService;
using Services.Interfaces;
using Services.Utils;
using DataTransferObjects.FactoryDTOs;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/staff-factories")]
    [ApiController]
    public class StaffFactoryController : ControllerBase
    {
        private readonly IStaffFactoryService _staffFactoryService;
        private readonly ILoggerService _logger;

        public StaffFactoryController(
            IStaffFactoryService staffFactoryService,
            ILoggerService logger)
        {
            _staffFactoryService = staffFactoryService;
            _logger = logger;
        }

        /// <summary>
        /// Assign a staff (User) to a factory (FactoryOwner).
        /// </summary>
        /// <param name="request">The DTO containing staffUserId and factoryOwnerId.</param>
        /// <returns>Returns the created <c>StaffFactory</c> record.</returns>
        [HttpPost("assign")]
        public async Task<IActionResult> AssignStaff([FromBody] AssignStaffRequestDTO request)
        {
            try
            {
                var staffFactory = await _staffFactoryService
                    .AssignStaffAsync(request.StaffUserId, request.FactoryOwnerId);

                return Ok(ApiResult<StaffFactoryDTO>.Success(staffFactory, "Assigned staff successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error assigning staff: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }
    }

    
}

