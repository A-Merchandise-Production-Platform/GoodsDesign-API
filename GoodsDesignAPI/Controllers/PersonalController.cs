﻿using BusinessObjects.Entities;
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
    public class PersonalController : ControllerBase
    {

        private readonly ILoggerService _logger;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        public PersonalController(ILoggerService logger, IUserService userService, INotificationService notificationService)
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
        [HttpPatch("me")]
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
                return Ok(ApiResult<int>.Success(
                    count, "Get unread notifications count successfully."
                    ));
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
                return Ok(ApiResult<Notification>.Success(null, "All notifications marked as read."));
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
        [HttpPut("me/notifications/{notificationId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SeenNotification(Guid notificationId)
        {
            try
            {
                var notification = await _notificationService.ReadNotification(notificationId);
                return Ok(ApiResult<Notification>.Success(notification, "Notification deleted successfully."));
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
                return Ok(ApiResult<Notification>.Success(null, "Notification deleted successfully."));
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


        /// <summary>
        /// Lấy tất cả địa chỉ của user login.
        /// </summary>
        [HttpGet("addresses")]
        public async Task<IActionResult> GetAllAddresses()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                //var user = await _userService.GetCurrentUser(userId);
                //if (user == null)
                //{
                //    _logger.Warn("User not found.");
                //    return NotFound(ApiResult<object>.Error("404 - User not found."));
                //}

                var addresses = await _userService.GetAllAddressesAsync(Guid.Parse(userId));
                return Ok(ApiResult<List<AddressModel>>.Success(addresses, "Addresses retrieved successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Lấy 1 địa chỉ theo index trong danh sách.
        /// </summary>
        /// <param name="index">Vị trí địa chỉ trong danh sách</param>
        [HttpGet("addresses/{index}")]
        public async Task<IActionResult> GetAddress( int index)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }
                var address = await _userService.GetAddressAsync(Guid.Parse(userId), index);
                if (address == null)
                    return NotFound(ApiResult<object>.Error("Address index out of range."));
                return Ok(ApiResult<AddressModel>.Success(address, "Address retrieved successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Thêm 1 địa chỉ mới vào danh sách của user login.
        /// </summary>
        /// <param name="dto">Dữ liệu địa chỉ mới</param>
        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress( [FromBody] AddressModel dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var newAddress = await _userService.AddAddressAsync(Guid.Parse(userId), dto);
                return Ok(ApiResult<AddressModel>.Success(newAddress, "Address added successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Cập nhật địa chỉ theo index.
        /// </summary>
        /// <param name="index">Vị trí địa chỉ cần update</param>
        /// <param name="dto">Dữ liệu địa chỉ mới</param>
        [HttpPut("addresses/{index}")]
        public async Task<IActionResult> UpdateAddress( int index, [FromBody] AddressModel dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var updated = await _userService.UpdateAddressAsync(Guid.Parse(userId), index, dto);
                return Ok(ApiResult<AddressModel>.Success(updated, "Address updated successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Xóa địa chỉ theo index khỏi danh sách.
        /// </summary>
        /// <param name="index">Vị trí địa chỉ cần xóa</param>
        [HttpDelete("addresses/{index}")]
        public async Task<IActionResult> DeleteAddress( int index)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }


                var success = await _userService.DeleteAddressAsync(Guid.Parse(userId), index);
                if (!success)
                    return BadRequest(ApiResult<object>.Error("Failed to delete address."));
                return Ok(ApiResult<object>.Success(null, "Address deleted successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResult<object>.Error(ex.Message));
            }
        }


    }
}
