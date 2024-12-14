using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.Auth;
using DataTransferObjects.FactoryDTOs;
using Moq;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Services;
using Xunit;

namespace UnitTest
{
    public class FactoryServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILoggerService> _loggerMock;
        private readonly Mock<IUserService> _userServiceMock;
        private readonly IFactoryService _factoryService;

        public FactoryServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILoggerService>();
            _userServiceMock = new Mock<IUserService>();

            _factoryService = new FactoryService(
                _loggerMock.Object,
                _mapperMock.Object,
                _unitOfWorkMock.Object,
                _userServiceMock.Object);
        }

        [Fact]
        public async Task CreateFactory_ReturnsCreatedFactory()
        {
            // Arrange
            var factoryDTO = new FactoryDTO
            {
                FactoryOwnerId = Guid.NewGuid(),
                Information = "{\"size\":\"large\",\"location\":\"HCM\"}",
                Contract = "{\"duration\":\"2 years\",\"status\":\"active\"}"
            };

            var factory = new Factory
            {
                Id = Guid.NewGuid(),
                FactoryOwnerId = factoryDTO.FactoryOwnerId.Value,
                Information = factoryDTO.Information,
                Contract = factoryDTO.Contract
            };

            var userResponse = new GetCurrentUserResponseDTO
            {
                Id = factoryDTO.FactoryOwnerId,
                UserName = "FactoryOwner1",
                Email = "owner@example.com"
            };

            _userServiceMock.Setup(u => u.GetCurrentUser(factoryDTO.FactoryOwnerId.ToString()))
                .ReturnsAsync(userResponse);
            _mapperMock.Setup(m => m.Map<Factory>(factoryDTO)).Returns(factory);
            _unitOfWorkMock.Setup(u => u.FactoryRepository.AddAsync(It.IsAny<Factory>()))
                .ReturnsAsync(factory);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _factoryService.CreateFactory(factoryDTO);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(factoryDTO.FactoryOwnerId, result.FactoryOwnerId);
            Assert.Equal(factoryDTO.Information, result.Information);
            Assert.Equal(factoryDTO.Contract, result.Contract);

            _loggerMock.Verify(l => l.Info("Create factory attempt initiated."), Times.Once);
            _loggerMock.Verify(l => l.Success("Factory created successfully."), Times.Once);
            _unitOfWorkMock.Verify(u => u.FactoryRepository.AddAsync(It.IsAny<Factory>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateFactory_ThrowsKeyNotFoundException_WhenFactoryOwnerNotFound()
        {
            // Arrange
            var factoryDTO = new FactoryDTO
            {
                FactoryOwnerId = Guid.NewGuid(),
                Information = "{\"size\":\"large\",\"location\":\"HCM\"}",
                Contract = "{\"duration\":\"2 years\",\"status\":\"active\"}"
            };

            _userServiceMock.Setup(u => u.GetCurrentUser(factoryDTO.FactoryOwnerId.ToString()))
                .ReturnsAsync((GetCurrentUserResponseDTO?)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _factoryService.CreateFactory(factoryDTO));

            _loggerMock.Verify(l => l.Warn($"User with ID: {factoryDTO.FactoryOwnerId} not found."), Times.Once);
            _unitOfWorkMock.Verify(u => u.FactoryRepository.AddAsync(It.IsAny<Factory>()), Times.Never);
        }

        [Fact]
        public async Task UpdateFactory_ReturnsUpdatedFactory()
        {
            // Arrange
            var factoryId = Guid.NewGuid();
            var factoryDTO = new FactoryDTO
            {
                FactoryOwnerId = Guid.NewGuid(),
                Information = "{\"size\":\"medium\",\"location\":\"HN\"}",
                Contract = "{\"duration\":\"3 years\",\"status\":\"active\"}"
            };

            var existingFactory = new Factory
            {
                Id = factoryId,
                FactoryOwnerId = factoryDTO.FactoryOwnerId.Value,
                Information = "{\"size\":\"small\",\"location\":\"HCM\"}",
                Contract = "{\"duration\":\"1 year\",\"status\":\"inactive\"}"
            };

            var userResponse = new GetCurrentUserResponseDTO
            {
                Id = factoryDTO.FactoryOwnerId,
                UserName = "FactoryOwner2",
                Email = "owner2@example.com"
            };

            _unitOfWorkMock.Setup(u => u.FactoryRepository.GetByIdAsync(factoryId))
                .ReturnsAsync(existingFactory);
            _userServiceMock.Setup(u => u.GetCurrentUser(factoryDTO.FactoryOwnerId.Value.ToString()))
                .ReturnsAsync(userResponse);
            _mapperMock.Setup(m => m.Map(factoryDTO, existingFactory));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _factoryService.UpdateFactory(factoryId, factoryDTO);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(factoryDTO.Information, result.Information);
            Assert.Equal(factoryDTO.Contract, result.Contract);

            _loggerMock.Verify(l => l.Info($"Updating factory with ID: {factoryId}"), Times.Once);
            _loggerMock.Verify(l => l.Success("Factory updated successfully."), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteFactory_ReturnsDeletedFactory()
        {
            // Arrange
            var factoryId = Guid.NewGuid();

            var factory = new Factory
            {
                Id = factoryId,
                FactoryOwnerId = Guid.NewGuid(),
                Information = "{\"size\":\"medium\",\"location\":\"HN\"}",
                Contract = "{\"duration\":\"3 years\",\"status\":\"active\"}"
            };

            _unitOfWorkMock.Setup(u => u.FactoryRepository.GetByIdAsync(factoryId))
                .ReturnsAsync(factory);
            _unitOfWorkMock.Setup(u => u.FactoryRepository.SoftRemove(factory));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _factoryService.DeleteFactory(factoryId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(factoryId, result.Id);

            _loggerMock.Verify(l => l.Info($"Deleting factory with ID: {factoryId}"), Times.Once);
            _loggerMock.Verify(l => l.Success("Factory deleted successfully."), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
