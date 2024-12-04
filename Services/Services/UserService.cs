﻿using AutoMapper;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.Auth;
using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;

        public UserService(UserManager<User> userManager, RoleManager<Role> roleManager, ILoggerService logger, IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<GetCurrentUserResponseDTO> GetCurrentUser(string userId)
        {
            _logger.Info("Fetching current user info.");
            try
            {
                

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return null; // not found user
                }

                _logger.Success("Fetched current user info successfully.");

                Role role = await _roleManager.FindByNameAsync(Roles.CUSTOMER.ToString());
                return new GetCurrentUserResponseDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth,
                    ImageUrl = user.ImageUrl,
                    Role = role.Name
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<GetCurrentUserResponseDTO?> CreateUserAsync(UserCreateDTO userCreateDTO, string roleName)
        {
            _logger.Info("Creating a new user.");
            try
            {
                // Check if role exists
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    _logger.Warn($"Role '{roleName}' not found.");
                    throw new Exception("494-Invalid role name");
                }

                // Create user entity from DTO
                var user = new User
                {
                    Email = userCreateDTO.Email,
                    UserName = userCreateDTO.UserName,
                    PhoneNumber = userCreateDTO.PhoneNumber,
                    Gender = userCreateDTO.Gender.Value,
                    DateOfBirth = userCreateDTO.DateOfBirth,
                    ImageUrl = userCreateDTO.ImageUrl,
                    IsActive = true,
                    Role=role // add many -many role
                };

                // Create user in UserManager
                var result = await _userManager.CreateAsync(user, "123456"); // Replace with a proper password management strategy
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.Warn($"Failed to create user: {errors}");
                    return null; // Could not create user
                }

                // Assign role to the user
                var roleResult = await _userManager.AddToRoleAsync(user, roleName);
                if (!roleResult.Succeeded)
                {
                    var roleErrors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                    _logger.Warn($"Failed to assign role '{roleName}' to user: {roleErrors}");
                    return null; // Could not assign role
                }

                _logger.Success("User created successfully.");
                return new GetCurrentUserResponseDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth,
                    ImageUrl = user.ImageUrl,
                    Role = role.Name
                };
            }
            catch (Exception ex)
            {
                _logger.Error($"Error creating user: {ex.Message}");
                throw new Exception($"Error creating user: {ex.Message}");
            }
        }


        public async Task<UserDTO?> UpdateUserAsync(Guid userId, UserUpdateDTO userUpdateDTO)
        {
            _logger.Info($"Updating user with ID: {userId}");
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    _logger.Warn($"User with ID: {userId} not found.");
                    return null;
                }

                // Map updated properties from DTO to the User entity
                _mapper.Map(userUpdateDTO, user);

                // Update user in UserManager
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.Warn($"Failed to update user: {errors}");
                    return null;
                }

                _logger.Success($"User with ID: {userId} updated successfully.");

                // Return updated user as DTO
                return _mapper.Map<UserDTO>(user);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error updating user: {ex.Message}");
                throw new Exception($"Error updating user: {ex.Message}");
            }
        }

    }
}
