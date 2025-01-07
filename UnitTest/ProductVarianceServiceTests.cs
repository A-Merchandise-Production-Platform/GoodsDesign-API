using System;
using System.Text.Json;
using System.Threading.Tasks;
using BusinessObjects.Entities;
using DataTransferObjects.ProductVarianceDTOs;
using Moq;
using Repositories.Interfaces;
using Services.Interfaces.CommonService;
using Services.Services;
using Xunit;

namespace UnitTest
{
    public class ProductVarianceServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ILoggerService> _loggerMock;
        private readonly ProductVarianceService _service;

        public ProductVarianceServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _loggerMock = new Mock<ILoggerService>();
            _service = new ProductVarianceService(_loggerMock.Object, _unitOfWorkMock.Object);
        }

        // TEST CASE: CreateProductVariance - Success
        [Fact]
        public async Task CreateProductVariance_ReturnsCreatedProductVariance()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var information = new { Size = "Medium", Location = "HN" };

            var dto = new ProductVarianceDTO
            {
                ProductId = productId,
               // Information = information, // Truyền object thay vì chuỗi JSON
                BlankPrice = "120.50"
            };

            var product = new Product { Id = productId };
            var createdProductVariance = new ProductVariance
            {
                Id = Guid.NewGuid(),
                ProductId = productId,
                Information = JsonSerializer.Serialize(information), // Serialize từ DTO
                BlankPrice = dto.BlankPrice
            };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync(product);
            _unitOfWorkMock.Setup(u => u.ProductVarianceRepository.AddAsync(It.IsAny<ProductVariance>()))
                .ReturnsAsync(createdProductVariance);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _service.CreateProductVariance(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(productId, result.ProductId);
            Assert.Equal(JsonSerializer.Serialize(information), result.Information); // So sánh serialize trực tiếp
            Assert.Equal(dto.BlankPrice, result.BlankPrice);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }


        // TEST CASE: CreateProductVariance - Throws KeyNotFoundException for Invalid ProductId
        [Fact]
        public async Task CreateProductVariance_ThrowsKeyNotFoundException_WhenProductNotFound()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var information = new { Size = "Large" };
            var dto = new ProductVarianceDTO
            {
                ProductId = productId,
                Information = JsonSerializer.Serialize(information),
                BlankPrice = "150.00"
            };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync((Product)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.CreateProductVariance(dto));

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
        }

        // TEST CASE: UpdateProductVariance - Success
        [Fact]
        public async Task UpdateProductVariance_ReturnsUpdatedProductVariance()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var varianceId = Guid.NewGuid();
            var information = new { Size = "Medium", Location = "HN" };

            var dto = new ProductVarianceDTO
            {
                ProductId = productId,
                Information = JsonSerializer.Serialize(information),
                BlankPrice = "200.00"
            };

            var existingVariance = new ProductVariance
            {
                Id = varianceId,
                ProductId = productId,
                Information = JsonSerializer.Serialize(new { Size = "Small" }),
                BlankPrice = "150.00"
            };

            var product = new Product { Id = productId };

            _unitOfWorkMock.Setup(u => u.ProductVarianceRepository.GetByIdAsync(varianceId))
                .ReturnsAsync(existingVariance);
            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync(product);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _service.UpdateProductVariance(varianceId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(productId, result.ProductId);
            Assert.Equal(JsonSerializer.Serialize(dto.Information), result.Information);
            Assert.Equal(dto.BlankPrice, result.BlankPrice);

            _unitOfWorkMock.Verify(u => u.ProductVarianceRepository.GetByIdAsync(varianceId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // TEST CASE: UpdateProductVariance - Throws KeyNotFoundException for Invalid VarianceId
        [Fact]
        public async Task UpdateProductVariance_ThrowsKeyNotFoundException_WhenVarianceNotFound()
        {
            // Arrange
            var varianceId = Guid.NewGuid();
            var information = new { Size = "Medium", Location = "HN" };

            var dto = new ProductVarianceDTO

            {
                ProductId = Guid.NewGuid(),
                Information = JsonSerializer.Serialize(information),
                BlankPrice = "100.00"
            };

            _unitOfWorkMock.Setup(u => u.ProductVarianceRepository.GetByIdAsync(varianceId))
                .ReturnsAsync((ProductVariance)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateProductVariance(varianceId, dto));

            _unitOfWorkMock.Verify(u => u.ProductVarianceRepository.GetByIdAsync(varianceId), Times.Once);
        }

        // TEST CASE: DeleteProductVariance - Success
        [Fact]
        public async Task DeleteProductVariance_ReturnsDeletedProductVariance()
        {
            // Arrange
            var varianceId = Guid.NewGuid();
            var existingVariance = new ProductVariance
            {
                Id = varianceId,
                ProductId = Guid.NewGuid(),
                Information = JsonSerializer.Serialize(new { Size = "Medium" }),
                BlankPrice = "150.00"
            };

            _unitOfWorkMock.Setup(u => u.ProductVarianceRepository.GetByIdAsync(varianceId))
                .ReturnsAsync(existingVariance);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _service.DeleteProductVariance(varianceId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(varianceId, result.Id);

            _unitOfWorkMock.Verify(u => u.ProductVarianceRepository.GetByIdAsync(varianceId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // TEST CASE: DeleteProductVariance - Throws KeyNotFoundException for Invalid VarianceId
        [Fact]
        public async Task DeleteProductVariance_ThrowsKeyNotFoundException_WhenVarianceNotFound()
        {
            // Arrange
            var varianceId = Guid.NewGuid();

            _unitOfWorkMock.Setup(u => u.ProductVarianceRepository.GetByIdAsync(varianceId))
                .ReturnsAsync((ProductVariance)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteProductVariance(varianceId));

            _unitOfWorkMock.Verify(u => u.ProductVarianceRepository.GetByIdAsync(varianceId), Times.Once);
        }
    }
}
