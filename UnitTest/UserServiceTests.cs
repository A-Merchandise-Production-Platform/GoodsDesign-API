using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Moq;
using Services.Interfaces.CommonService;
using Services.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest
{
    public class UserServiceTests
    {
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly Mock<RoleManager<Role>> _roleManagerMock;
        private readonly Mock<ILoggerService> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            _userManagerMock = new Mock<UserManager<User>>(userStoreMock.Object, null, null, null, null, null, null, null, null);

            var roleStoreMock = new Mock<IRoleStore<Role>>();
            _roleManagerMock = new Mock<RoleManager<Role>>(roleStoreMock.Object, null, null, null, null);

            _loggerMock = new Mock<ILoggerService>();
            _mapperMock = new Mock<IMapper>();

            _userService = new UserService(_userManagerMock.Object, _roleManagerMock.Object, _loggerMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task GetCurrentUser_ReturnsUser_WhenUserExists()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var user = new User
            {
                Id = Guid.Parse(userId),
                Email = "test@example.com",
                UserName = "testuser",
                PhoneNumber = "123456789",
                Gender = true,
                DateOfBirth = DateTime.UtcNow.AddYears(-25),
                ImageUrl = "https://example.com/image.png"
            };

            var role = new Role { Name = "Customer" };

            _userManagerMock.Setup(um => um.FindByIdAsync(userId)).ReturnsAsync(user);
            _roleManagerMock.Setup(rm => rm.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(role);

            // Act
            var result = await _userService.GetCurrentUser(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.UserName, result.UserName);
            Assert.Equal(role.Name, result.Role);
        }


        [Fact]
        public async Task CreateUserAsync_ReturnsCreatedUser_WhenRoleExists()
        {
            // Arrange
            var userCreateDto = new UserCreateDTO
            {
                Email = "newuser@example.com",
                UserName = "newuser",
                PhoneNumber = "987654321",
                Gender = false,
                DateOfBirth = DateTime.UtcNow.AddYears(-20),
                ImageUrl = "https://example.com/newimage.png"
            };

            var roleName = "Customer";
            var role = new Role { Name = roleName };
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = userCreateDto.Email,
                UserName = userCreateDto.UserName,
                PhoneNumber = userCreateDto.PhoneNumber,
                Gender = userCreateDto.Gender.Value,
                DateOfBirth = userCreateDto.DateOfBirth,
                ImageUrl = userCreateDto.ImageUrl
            };

            _roleManagerMock.Setup(rm => rm.FindByNameAsync(roleName)).ReturnsAsync(role);
            _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(um => um.AddToRoleAsync(It.IsAny<User>(), roleName)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _userService.CreateUserAsync(userCreateDto, roleName);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.UserName, result.UserName);
            Assert.Equal(role.Name, result.Role);
        }

        [Fact]
        public async Task UpdateUserAsync_ReturnsUpdatedUser_WhenUserExists()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userUpdateDto = new UserUpdateDTO
            {
                UserName = "updateduser",
                PhoneNumber = "987654321",
                Password = "NewPassword123"
            };

            var user = new User
            {
                Id = userId,
                UserName = "olduser",
                PhoneNumber = "123456789"
            };

            _userManagerMock.Setup(um => um.FindByIdAsync(userId.ToString())).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.RemovePasswordAsync(user)).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(um => um.AddPasswordAsync(user, userUpdateDto.Password)).ReturnsAsync(IdentityResult.Success);
            _userManagerMock.Setup(um => um.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);
            _mapperMock.Setup(m => m.Map<UserDTO>(user)).Returns(new UserDTO { Id = user.Id });

            // Act
            var result = await _userService.UpdateUserAsync(userId, userUpdateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userUpdateDto.UserName, user.UserName);
            Assert.Equal(userUpdateDto.PhoneNumber, user.PhoneNumber);
        }

        [Fact]
        public async Task DeleteUserAsync_ReturnsDeletedUser_WhenUserExists()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                UserName = "userToDelete",
                IsDeleted = false
            };

            _userManagerMock.Setup(um => um.FindByIdAsync(userId.ToString())).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);
            _mapperMock.Setup(m => m.Map<UserDTO>(user)).Returns(new UserDTO { Id = user.Id });

            // Act
            var result = await _userService.DeleteUserAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.True(user.IsDeleted);
        }

        [Fact]
        public async Task BanUserAsync_TogglesUserIsActive_WhenUserExists()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                IsActive = true
            };

            _userManagerMock.Setup(um => um.FindByIdAsync(userId.ToString())).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);
            _mapperMock.Setup(m => m.Map<UserDTO>(user)).Returns(new UserDTO { Id = user.Id });

            // Act
            var result = await _userService.UpdateActiveStatusUser(userId);

            // Assert
            Assert.NotNull(result);
            Assert.False(user.IsActive); // User is banned
        }
    }
}
