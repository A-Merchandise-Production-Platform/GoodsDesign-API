using BusinessObjects.Entities;
using DataTransferObjects.Auth;
using DataTransferObjects.UserDTOs;

namespace Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO> UpdateActiveStatusUser(Guid userId);
        Task<GetCurrentUserResponseDTO?> CreateUserAsync(UserCreateDTO userCreateDTO, string roleName);
        Task<UserDTO> DeleteUserAsync(Guid userId);
        Task<GetCurrentUserResponseDTO> GetCurrentUser(string userId);
        Task<UserDTO?> UpdateUserAsync(Guid userId, UserUpdateDTO userUpdateDTO);
        Task<List<AddressModel>> GetAllAddressesAsync(Guid userId);
        Task<AddressModel?> GetAddressAsync(Guid userId, int index);
        Task<AddressModel> AddAddressAsync(Guid userId, AddressModel address);
        Task<AddressModel> UpdateAddressAsync(Guid userId, int index, AddressModel address);
        Task<bool> DeleteAddressAsync(Guid userId, int index);
    }
}
