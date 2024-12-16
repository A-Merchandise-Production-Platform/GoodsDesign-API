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
    }
}
