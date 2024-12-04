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
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILoggerService _logger;

        public UserController(UserManager<User> userManager, RoleManager<Role> roleManager, ILoggerService logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
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

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.Warn("User not found.");
                    return NotFound(ApiResult<object>.Error("404 - User not found."));
                }

                _logger.Success("Fetched current user info successfully.");

                Role role = await _roleManager.FindByNameAsync(Roles.Customer.ToString());
                return Ok(ApiResult<object>.Success(new GetCurrentUserResponseDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth,
                    ImageUrl = user.ImageUrl,
                    Role = role.Name
                }, "User information retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching user info: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("500 - An error occurred while retrieving user information."));
            }
        }
    }
}
