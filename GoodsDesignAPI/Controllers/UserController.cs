using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
    
        private readonly ILoggerService _logger;
        private readonly IUserService _userService;

        public UserController(ILoggerService logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            _logger.Info("Fetching current user info.");
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var user = await _userService.GetCurrentUser(userId);
                if (user == null)
                {
                    _logger.Warn("User not found.");
                    return NotFound(ApiResult<object>.Error("404 - User not found."));
                }

                _logger.Success("Fetched current user info successfully.");

               // Role role = await _roleManager.FindByNameAsync(Roles.Customer.ToString());
                return Ok(ApiResult<object>.Success(user, "User information retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching user info: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("500 - An error occurred while retrieving user information."));
            }
        }
    }
}
