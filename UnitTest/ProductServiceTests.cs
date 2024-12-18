using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.ProductDTOs;
using Moq;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Services;

namespace UnitTest
{
    public class ProductServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILoggerService> _loggerMock;
        private readonly IProductService _productService;

        public ProductServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILoggerService>();

            _productService = new ProductService(_loggerMock.Object, _mapperMock.Object, _unitOfWorkMock.Object);
        }

        // Test case 1: Create Product Successfully
        [Fact]
        public async Task CreateProduct_ReturnsCreatedProduct()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var productDto = new ProductDTO
            {
                Name = "Test Product",
                Description = "Test Description",
                CategoryId = categoryId,
                ImageUrl = "https://example.com/image.jpg",
                Model3DUrl = "https://example.com/3dmodel"
            };

            var category = new Category { Id = categoryId, Name = "Category Name" };

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = productDto.Name,
                Description = productDto.Description,
                CategoryId = categoryId,
                ImageUrl = productDto.ImageUrl,
                Model3DUrl = productDto.Model3DUrl
            };

            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.GetByIdAsync(categoryId))
                .ReturnsAsync(category);
            _mapperMock.Setup(m => m.Map<Product>(productDto)).Returns(product);
            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.AddAsync(It.IsAny<Product>()))
                .ReturnsAsync(product);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _productService.CreateProduct(productDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(productDto.Name, result.Name);
            Assert.Equal(productDto.Description, result.Description);
            Assert.Equal(productDto.CategoryId, result.CategoryId);

            _unitOfWorkMock.Verify(u => u.CategoryGenericRepository.GetByIdAsync(categoryId), Times.Once);
            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.AddAsync(It.IsAny<Product>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // Test case 2: Create Product - Category Not Found
        [Fact]
        public async Task CreateProduct_ThrowsException_WhenCategoryNotFound()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var productDto = new ProductDTO
            {
                Name = "Test Product",
                Description = "Test Description",
                CategoryId = categoryId
            };

            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.GetByIdAsync(categoryId))
                .ReturnsAsync((Category)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _productService.CreateProduct(productDto));
            Assert.Contains("Category not found", exception.Message);

            _unitOfWorkMock.Verify(u => u.CategoryGenericRepository.GetByIdAsync(categoryId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Never);
        }

        // Test case 3: Update Product Successfully
        [Fact]
        public async Task UpdateProduct_ReturnsUpdatedProduct()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var categoryId = Guid.NewGuid();

            var productDto = new ProductDTO
            {
                Name = "Updated Product",
                Description = "Updated Description",
                CategoryId = categoryId
            };

            var existingProduct = new Product
            {
                Id = productId,
                Name = "Old Product",
                Description = "Old Description",
                CategoryId = categoryId
            };

            var category = new Category { Id = categoryId, Name = "Category Name" };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync(existingProduct);
            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.GetByIdAsync(categoryId))
                .ReturnsAsync(category);
            _mapperMock.Setup(m => m.Map(productDto, existingProduct));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _productService.UpdateProduct(productId, productDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(productDto.Name, result.Name);
            Assert.Equal(productDto.Description, result.Description);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // Test case 4: Update Product - Product Not Found
        [Fact]
        public async Task UpdateProduct_ThrowsException_WhenProductNotFound()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var productDto = new ProductDTO
            {
                Name = "Updated Product",
                Description = "Updated Description"
            };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync((Product)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _productService.UpdateProduct(productId, productDto));
            Assert.Contains("Product not found", exception.Message);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Never);
        }

        // Test case 5: Delete Product Successfully
        [Fact]
        public async Task DeleteProduct_ReturnsDeletedProduct()
        {
            // Arrange
            var productId = Guid.NewGuid();
            var product = new Product
            {
                Id = productId,
                Name = "Product to Delete"
            };

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync(product);
            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.SoftRemove(product));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _productService.DeleteProduct(productId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(product.Name, result.Name);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.SoftRemove(product), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        // Test case 6: Delete Product - Product Not Found
        [Fact]
        public async Task DeleteProduct_ThrowsException_WhenProductNotFound()
        {
            // Arrange
            var productId = Guid.NewGuid();

            _unitOfWorkMock.Setup(u => u.ProductGenericRepository.GetByIdAsync(productId))
                .ReturnsAsync((Product)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _productService.DeleteProduct(productId));
            Assert.Contains("Product not found", exception.Message);

            _unitOfWorkMock.Verify(u => u.ProductGenericRepository.GetByIdAsync(productId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Never);
        }
    }
}
