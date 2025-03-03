using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //Create, Update, Delete, Ban, Unban

        private readonly ILoggerService _logger;
        private readonly IUserService _userService;

        public UsersController(ILoggerService logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }


        //[HttpPost]
        //public async Task<IActionResult> CreateUser([FromBody] User user)
        //{
        //    _logger.Info("Create user attempt initiated.");
        //    try
        //    {
        //        throw new Exception("500 - Not implemented yet.");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error($"Error during registration: {ex.Message}");
        //        int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
        //        var errorResponse = ApiResult<object>.Error(ex.Message);

        //        return StatusCode(statusCode, errorResponse);
        //    }
        //}



        [HttpPost()]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDTO userCreateDTO, Roles role)
        {
            _logger.Info("Attempting to create user via controller.");
            string roleName = string.IsNullOrEmpty(role.ToString()) ? role.ToString() : "CUSTOMER";

            try
            {
                var user = await _userService.CreateUserAsync(userCreateDTO, roleName);
                if (user == null)
                {
                    _logger.Warn("User creation failed.");
                    return BadRequest(ApiResult<object>.Error("User creation failed. Please check the input data or role."));
                }

                _logger.Success("User created successfully via controller.");
                return Ok(ApiResult<object>.Success(user, "User created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during creating user: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
                // return StatusCode(500, ApiResult<object>.Error("500 - An error occurred while creating the user."));
            }
        }


        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDTO userUpdateDTO)
        {
            _logger.Info($"Attempting to update user with ID: {id}");
            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, userUpdateDTO);
                if (updatedUser == null)
                {
                    _logger.Warn("User update failed.");
                    return NotFound(ApiResult<object>.Error("User update failed. User not found."));
                }

                _logger.Success("User updated successfully via controller.");
                return Ok(ApiResult<object>.Success(updatedUser, "User updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during updating user: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            _logger.Info($"Attempting to delete user with ID: {id}");
            try
            {
                var result = await _userService.DeleteUserAsync(id);
                if (result == null)
                {
                    _logger.Warn("User deletion failed.");
                    return NotFound(ApiResult<object>.Error("User deletion failed. User not found."));
                }

                _logger.Success("User deleted successfully via controller.");
                return Ok(ApiResult<object>.Success(result, "User deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during deleting user: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        // [Authorize(Roles = "Admin")]
        [HttpPut("{id}/active")]
        public async Task<IActionResult> BanUser(Guid id)
        {
            _logger.Info($"Attempting to ban/unban user with ID: {id}");
            try
            {
                var result = await _userService.UpdateActiveStatusUser(id);
                if (result == null)
                {
                    _logger.Warn("User ban/unban failed.");
                    return NotFound(ApiResult<object>.Error("User ban/unban failed. User not found."));
                }

                _logger.Success("User ban/unban action completed successfully via controller.");
                return Ok(ApiResult<object>.Success(result, "User ban/unban action completed successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during banning/unbanning user: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        /// <summary>
        /// Lấy tất cả địa chỉ của user.
        /// </summary>
        /// <param name="id">ID của user</param>
        [HttpGet("{id}/addresses")]
        public async Task<IActionResult> GetAllAddresses(Guid id)
        {
            try
            {
                var addresses = await _userService.GetAllAddressesAsync(id);
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
        /// <param name="id">ID của user</param>
        /// <param name="index">Vị trí địa chỉ trong danh sách</param>
        [HttpGet("{id}/addresses/{index}")]
        public async Task<IActionResult> GetAddress(Guid id, int index)
        {
            try
            {
                var address = await _userService.GetAddressAsync(id, index);
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
        /// Thêm 1 địa chỉ mới vào danh sách của user.
        /// </summary>
        /// <param name="id">ID của user</param>
        /// <param name="dto">Dữ liệu địa chỉ mới</param>
        [HttpPost("{id}/addresses")]
        public async Task<IActionResult> AddAddress(Guid id, [FromBody] AddressModel dto)
        {
            try
            {
                var newAddress = await _userService.AddAddressAsync(id, dto);
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
        /// <param name="id">ID của user</param>
        /// <param name="index">Vị trí địa chỉ cần update</param>
        /// <param name="dto">Dữ liệu địa chỉ mới</param>
        [HttpPut("{id}/addresses/{index}")]
        public async Task<IActionResult> UpdateAddress(Guid id, int index, [FromBody] AddressModel dto)
        {
            try
            {
                var updated = await _userService.UpdateAddressAsync(id, index, dto);
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
        /// <param name="id">ID của user</param>
        /// <param name="index">Vị trí địa chỉ cần xóa</param>
        [HttpDelete("{id}/addresses/{index}")]
        public async Task<IActionResult> DeleteAddress(Guid id, int index)
        {
            try
            {
                var success = await _userService.DeleteAddressAsync(id, index);
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
