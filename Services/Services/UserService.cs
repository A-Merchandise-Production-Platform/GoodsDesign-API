using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.Auth;
using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Services.Interfaces;

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

                Role role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
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
                    throw new Exception("400 - Invalid role name");
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
                    Role = role // add many -many role
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
                throw new Exception($"400 - Error creating user: {ex.Message}");
            }
        }


        public async Task<UserDTO> UpdateUserAsync(Guid userId, UserUpdateDTO userUpdateDTO)
        {
            _logger.Info($"Updating user with ID: {userId}");
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    _logger.Warn($"User with ID: {userId} not found.");
                    throw new KeyNotFoundException($"User with ID: {userId} not found."); // Có thể bắt KeyNotFoundException để trả 404.
                }

                // Map updated properties from DTO to the User entity
                _mapper.Map(userUpdateDTO, user);

                // Handle password update if provided
                if (!string.IsNullOrEmpty(userUpdateDTO.Password))
                {
                    var removePasswordResult = await _userManager.RemovePasswordAsync(user);
                    if (!removePasswordResult.Succeeded)
                    {
                        var removePasswordErrors = string.Join(", ", removePasswordResult.Errors.Select(e => e.Description));
                        throw new InvalidOperationException($"Failed to remove current password: {removePasswordErrors}"); // Lỗi nghiệp vụ.
                    }

                    var addPasswordResult = await _userManager.AddPasswordAsync(user, userUpdateDTO.Password);
                    if (!addPasswordResult.Succeeded)
                    {
                        var addPasswordErrors = string.Join(", ", addPasswordResult.Errors.Select(e => e.Description));
                        throw new InvalidOperationException($"Failed to update password: {addPasswordErrors}"); // Lỗi nghiệp vụ.
                    }
                }

                // Update user in UserManager
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to update user: {errors}"); // Lỗi nghiệp vụ.
                }

                _logger.Success($"User with ID: {userId} updated successfully.");
                return _mapper.Map<UserDTO>(user);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn(ex.Message);
                throw; // Để controller trả mã lỗi 404.
            }
            catch (InvalidOperationException ex)
            {
                _logger.Warn(ex.Message);
                throw; // Để controller trả mã lỗi 400.
            }
            catch (Exception ex)
            {
                _logger.Error($"Unexpected error updating user: {ex.Message}");
                throw new Exception("An unexpected error occurred while updating the user.", ex); // Mặc định 500.
            }
        }

        public async Task<UserDTO?> DeleteUserAsync(Guid userId)
        {
            _logger.Info($"Deleting user with ID: {userId}");
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    _logger.Warn($"User with ID: {userId} not found.");
                    throw new Exception($"404 - User with ID: {userId} not found.");
                }

                user.IsDeleted = true;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.Warn($"Failed to delete user: {errors}");
                    return null;
                }

                _logger.Success($"User with ID: {userId} deleted successfully.");
                return _mapper.Map<UserDTO>(user);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error deleting user: {ex.Message}");
                throw new Exception($"404 - Error deleting user: {ex.Message}");
            }
        }

        public async Task<UserDTO?> BanUserAsync(Guid userId)
        {
            _logger.Info($"Banning/unbanning user with ID: {userId}");
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    _logger.Warn($"User with ID: {userId} not found.");
                    return null;
                }

                user.IsActive = !user.IsActive;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.Warn($"Failed to ban/unban user: {errors}");
                    return null;
                }

                _logger.Success($"User with ID: {userId} ban/unban action completed successfully.");
                return _mapper.Map<UserDTO>(user);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error banning/unbanning user: {ex.Message}");
                throw new Exception($"Error banning/unbanning user: {ex.Message}");
            }
        }

    }
}
