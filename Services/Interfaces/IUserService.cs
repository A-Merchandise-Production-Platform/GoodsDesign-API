using DataTransferObjects.Auth;
using DataTransferObjects.UserDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO> BanUserAsync(Guid userId);
        Task<GetCurrentUserResponseDTO?> CreateUserAsync(UserCreateDTO userCreateDTO, string roleName);
        Task<UserDTO> DeleteUserAsync(Guid userId);
        Task<GetCurrentUserResponseDTO> GetCurrentUser(string userId);
        Task<UserDTO?> UpdateUserAsync(Guid userId, UserUpdateDTO userUpdateDTO);
    }
}
