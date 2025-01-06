using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.CategoryDTOs;
using Moq;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Services;

namespace UnitTest
{
    public class CategoryServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILoggerService> _loggerMock;
        private readonly ICategoryService _categoryService;

        public CategoryServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILoggerService>();

            _categoryService = new CategoryService(_loggerMock.Object, _mapperMock.Object, _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task CreateCategory_ReturnsCreatedCategory()
        {
            // Arrange
            var categoryDto = new CategoryDTO
            {
                Name = "Test Category",
                Description = "Description for test category",
                ImageUrl = "https://example.com/image.png"
            };

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = "Test Category",
                Description = "Description for test category",
                ImageUrl = "https://example.com/image.png"
            };

            _mapperMock.Setup(m => m.Map<Category>(categoryDto)).Returns(category);
            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.AddAsync(It.IsAny<Category>()))
                .ReturnsAsync(category);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _categoryService.CreateCategory(categoryDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(category.Name, result.Name);
            Assert.Equal(category.Description, result.Description);
            Assert.Equal(category.ImageUrl, result.ImageUrl);

            _unitOfWorkMock.Verify(u => u.CategoryGenericRepository.AddAsync(It.IsAny<Category>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateCategory_ReturnsUpdatedCategory()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var categoryResultDto = new CategoryDTO
            {
                Name = "Updated Category",
                Description = "Updated Description",
                ImageUrl = "https://example.com/new-image.png"
            };

            var categoryDto = new CategoryDTO
            {
                Name = "Updated Category",
                Description = "Updated Description",
                ImageUrl = "https://example.com/new-image.png"
            };

            var existingCategory = new Category
            {
                Id = categoryId,
                Name = "Old Category",
                Description = "Old Description",
                ImageUrl = "https://example.com/old-image.png"
            };

            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.GetByIdAsync(categoryId))
                .ReturnsAsync(existingCategory);
            _mapperMock.Setup(m => m.Map(categoryDto, existingCategory));
            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.Update(existingCategory));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _categoryService.UpdateCategory(categoryId, categoryDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(categoryDto.Name, result.Name);
            Assert.Equal(categoryDto.Description, result.Description);
            Assert.Equal(categoryDto.ImageUrl, result.ImageUrl);

            _unitOfWorkMock.Verify(u => u.CategoryGenericRepository.GetByIdAsync(categoryId), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsDeletedCategory()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var category = new Category
            {
                Id = categoryId,
                Name = "Category to Delete",
                Description = "Description",
                ImageUrl = "https://example.com/image.png"
            };

            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.GetByIdAsync(categoryId))
                .ReturnsAsync(category);
            _unitOfWorkMock.Setup(u => u.CategoryGenericRepository.SoftRemove(category));
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _categoryService.DeleteCategory(categoryId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(category.Name, result.Name);
            Assert.Equal(category.Description, result.Description);
            Assert.Equal(category.ImageUrl, result.ImageUrl);

            _unitOfWorkMock.Verify(u => u.CategoryGenericRepository.GetByIdAsync(categoryId), Times.Once);
            _unitOfWorkMock.Verify(u => u.CategoryGenericRepository.SoftRemove(category), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
