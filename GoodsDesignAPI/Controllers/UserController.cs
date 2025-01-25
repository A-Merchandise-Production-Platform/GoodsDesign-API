using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;
using System.Security.Claims;

namespace GoodsDesignAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly ILoggerService _logger;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        public UserController(ILoggerService logger, IUserService userService, INotificationService notificationService)
        {
            _logger = logger;
            _userService = userService;
            _notificationService = notificationService;
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

                return Ok(ApiResult<object>.Success(user, "User information retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching user info: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateCurrentUser(UserUpdateDTO userUpdateDTO)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userId, out var guid))
                    return BadRequest(ApiResult<object>.Error("Invalid User ID."));

                var updatedUser = await _userService.UpdateUserAsync(guid, userUpdateDTO);
                return Ok(ApiResult<object>.Success(updatedUser, "User updated successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error updating user info: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Get the count of unread notifications for a user.
        /// </summary>
        /// <returns>Count of unread notifications</returns>
        [HttpGet("me/notifications/count")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUnreadNotificationsCount()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userId, out var guid))
                    return BadRequest(ApiResult<object>.Error("Invalid UserId!"));

                var count = await _notificationService.GetUnreadNotificationsCount(Guid.Parse(userId));
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching unread notifications count: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Mark all notifications as read for a user.
        /// </summary>
        /// <returns>Status</returns>
        [HttpPut("me/notifications/read-all")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ReadAllNotifications()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userId, out var guid))
                    return BadRequest(ApiResult<object>.Error("Invalid UserId!"));

                await _notificationService.ReadAllNotifications(Guid.Parse(userId));
                return Ok(ApiResult<object>.Success(null, "All notifications marked as read."));
            }
            catch (Exception ex)
            {
                _logger.Error($"An error occurred while marking all notifications as read: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Get and mark a specific notification as read/seen.
        /// </summary>
        /// <param name="id">Notification ID</param>
        /// <returns>Notification</returns>
        [HttpGet("me/notifications/{notificationId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SeenNotification(Guid id)
        {
            try
            {
                var notification = await _notificationService.ReadNotification(id);
                return Ok(notification);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Error(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error ReadNotification: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Delete a specific notification.
        /// </summary>
        /// <param name="id">Notification ID</param>
        /// <returns>Status</returns>
        [HttpDelete("me/notifications/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            try
            {
                await _notificationService.DeleteNotification(id);
                return Ok("Notification deleted successfully.");
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Error(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error DeleteNotification: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }


    }
}
