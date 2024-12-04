﻿using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Services;
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


        [HttpPut("{id}")]
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


    }
}
