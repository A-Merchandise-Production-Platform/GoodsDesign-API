using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.ProductPositionTypeDTOs;
using Moq;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Services;

namespace UnitTest
{
    public class ProductPositionTypeServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ILoggerService> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ProductPositionTypeService _service;

        public ProductPositionTypeServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _loggerMock = new Mock<ILoggerService>();
            _mapperMock = new Mock<IMapper>();

            _service = new ProductPositionTypeService(_unitOfWorkMock.Object, _loggerMock.Object, _mapperMock.Object);
        }

        // Test 1: Create ProductPositionType Successfully
        [Fact]
        public async Task CreateProductPositionType_ReturnsCreatedObject()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var dto = new ProductPositionTypeDTO
            {
                ProductId = productId,
                PositionName = "Front View",
                BasePrice = 1000m
            };

            var product = new Product { Id = productId };
            var entity = new ProductPositionType
            {
                ProductId = productId,
                PositionName = dto.PositionName,
                BasePrice = dto.BasePrice
            };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync(product);
            _mapperMock.Setup(m => m.Map<ProductPositionType>(dto)).Returns(entity);
            _unitOfWorkMock.Setup(u => u.ProductPositionTypeRepository.AddAsync(entity))
                .ReturnsAsync(entity);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _service.CreateProductPositionType(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.PositionName, result.PositionName);
            Assert.Equal(dto.BasePrice, result.BasePrice);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.ProductPositionTypeRepository.AddAsync(It.IsAny<ProductPositionType>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // Test 2: Create ProductPositionType - Product Not Found
        [Fact]
        public async Task CreateProductPositionType_ThrowsException_WhenProductNotFound()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var dto = new ProductPositionTypeDTO { ProductId = productId };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync((Product)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.CreateProductPositionType(dto));
            Assert.Contains("Product not found", exception.Message);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Never);
        }

        // Test 3: Update ProductPositionType Successfully
        [Fact]
        public async Task UpdateProductPositionType_ReturnsUpdatedObject()
        {
            // Arrange
            var id = Guid.NewGuid();
            var dto = new ProductPositionTypeDTO
            {
                PositionName = "Updated Position",
                BasePrice = 1200m
            };

            var existing = new ProductPositionType
            {
                Id = id,
                PositionName = "Old Position",
                BasePrice = 1000m
            };

            _unitOfWorkMock.Setup(u => u.ProductPositionTypeRepository.GetByIdAsync(id))
                .ReturnsAsync(existing);
            _mapperMock.Setup(m => m.Map(dto, existing));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _service.UpdateProductPositionType(id, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.PositionName, result.PositionName);
            Assert.Equal(dto.BasePrice, result.BasePrice);

            _unitOfWorkMock.Verify(u => u.ProductPositionTypeRepository.GetByIdAsync(id), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // Test 4: Update ProductPositionType - Not Found
        [Fact]
        public async Task UpdateProductPositionType_ThrowsException_WhenNotFound()
        {
            // Arrange
            var id = Guid.NewGuid();
            var dto = new ProductPositionTypeDTO { PositionName = "Test", BasePrice = 500m };

            _unitOfWorkMock.Setup(u => u.ProductPositionTypeRepository.GetByIdAsync(id))
                .ReturnsAsync((ProductPositionType)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateProductPositionType(id, dto));
            Assert.Contains("ProductPositionType not found", exception.Message);

            _unitOfWorkMock.Verify(u => u.ProductPositionTypeRepository.GetByIdAsync(id), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Never);
        }

        // Test 5: Delete ProductPositionType Successfully
        [Fact]
        public async Task DeleteProductPositionType_ReturnsDeletedObject()
        {
            // Arrange
            var id = Guid.NewGuid();
            var existing = new ProductPositionType { Id = id };

            _unitOfWorkMock.Setup(u => u.ProductPositionTypeRepository.GetByIdAsync(id))
                .ReturnsAsync(existing);
            _unitOfWorkMock.Setup(u => u.ProductPositionTypeRepository.SoftRemove(existing));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _service.DeleteProductPositionType(id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(id, result.Id);

            _unitOfWorkMock.Verify(u => u.ProductPositionTypeRepository.GetByIdAsync(id), Times.Once);
            _unitOfWorkMock.Verify(u => u.ProductPositionTypeRepository.SoftRemove(existing), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // Test 6: Delete ProductPositionType - Not Found
        [Fact]
        public async Task DeleteProductPositionType_ThrowsException_WhenNotFound()
        {
            // Arrange
            var id = Guid.NewGuid();

            _unitOfWorkMock.Setup(u => u.ProductPositionTypeRepository.GetByIdAsync(id))
                .ReturnsAsync((ProductPositionType)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteProductPositionType(id));
            Assert.Contains("ProductPositionType not found", exception.Message);

            _unitOfWorkMock.Verify(u => u.ProductPositionTypeRepository.GetByIdAsync(id), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Never);
        }
    }
}
