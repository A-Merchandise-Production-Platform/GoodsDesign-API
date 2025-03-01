using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.Auth;
using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

                if(!userCreateDTO.Addresses.IsNullOrEmpty())
                {
                    user.Addresses = userCreateDTO.Addresses;
                }

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
                    Role = role.Name,
                    Addresses= user.Addresses


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
                    throw new KeyNotFoundException($"User with ID: {userId} not found.");
                }

                // 🔹 Duyệt qua tất cả properties của UserUpdateDTO
                foreach (var property in typeof(UserUpdateDTO).GetProperties())
                {
                    if (property.Name == nameof(userUpdateDTO.Addresses)) continue; // Bỏ qua danh sách địa chỉ

                    var newValue = property.GetValue(userUpdateDTO);
                    if (newValue != null) // Chỉ cập nhật nếu không phải null
                    {
                        var userProperty = typeof(User).GetProperty(property.Name);
                        if (userProperty != null && userProperty.CanWrite)
                        {
                            userProperty.SetValue(user, newValue);
                        }
                    }
                }
                if(userUpdateDTO.Addresses != null)
                {
                    user.Addresses = userUpdateDTO.Addresses;
                }

                // 🔹 Xử lý cập nhật password nếu có truyền vào
                if (!string.IsNullOrEmpty(userUpdateDTO.Password))
                {
                    var removePasswordResult = await _userManager.RemovePasswordAsync(user);
                    if (!removePasswordResult.Succeeded)
                    {
                        throw new InvalidOperationException($"Failed to remove current password: {string.Join(", ", removePasswordResult.Errors.Select(e => e.Description))}");
                    }

                    var addPasswordResult = await _userManager.AddPasswordAsync(user, userUpdateDTO.Password);
                    if (!addPasswordResult.Succeeded)
                    {
                        throw new InvalidOperationException($"Failed to update password: {string.Join(", ", addPasswordResult.Errors.Select(e => e.Description))}");
                    }
                }

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    throw new InvalidOperationException($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }

                _logger.Success($"User with ID: {userId} updated successfully.");
                return _mapper.Map<UserDTO>(user);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn(ex.Message);
                throw;
            }
            catch (InvalidOperationException ex)
            {
                _logger.Warn(ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                _logger.Error($"Unexpected error updating user: {ex.Message}");
                throw new Exception("An unexpected error occurred while updating the user.", ex);
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
                user.IsActive = false;
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

        public async Task<UserDTO?> UpdateActiveStatusUser(Guid userId)
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
                if(user.IsDeleted)
                {
                    _logger.Error($"User with ID: {userId} had been deleted.");
                    throw new Exception("Cannot change, this account had been deleted");
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

        public async Task<List<AddressModel>> GetAllAddressesAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new KeyNotFoundException("User not found.");
            return user.Addresses;
        }

        public async Task<AddressModel?> GetAddressAsync(Guid userId, int index)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new KeyNotFoundException("User not found.");
            if (index < 0 || index >= user.Addresses.Count) return null; // out of range
            return user.Addresses[index];
        }

        public async Task<AddressModel> AddAddressAsync(Guid userId, AddressModel address)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new KeyNotFoundException("User not found.");

            user.Addresses.Add(address);
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception("Failed to add address.");

            return address;
        }

        public async Task<AddressModel> UpdateAddressAsync(Guid userId, int index, AddressModel address)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new KeyNotFoundException("User not found.");
            if (index < 0 || index >= user.Addresses.Count)
                throw new KeyNotFoundException("Address index out of range.");

            // Ghi đè toàn bộ
            user.Addresses[index] = address;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception("Failed to update address.");

            return address;
        }

        public async Task<bool> DeleteAddressAsync(Guid userId, int index)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new KeyNotFoundException("User not found.");
            if (index < 0 || index >= user.Addresses.Count)
                throw new KeyNotFoundException("Address index out of range.");

            user.Addresses.RemoveAt(index);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception("Failed to delete address.");

            return true;
        }

    }
}
