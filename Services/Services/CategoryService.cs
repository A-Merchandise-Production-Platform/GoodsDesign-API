using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.CategoryDTOs;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(ILoggerService logger, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<Category> CreateCategory(CategoryDTO categoryDTO)
        {
            _logger.Info("Create category attempt initiated.");
            try
            {
                var param = _mapper.Map<Category>(categoryDTO);
                var result = await _unitOfWork.CategoryGenericRepository.AddAsync(param);
                await _unitOfWork.SaveChangesAsync();
                _logger.Success("Category created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during category creation: {ex.Message}");
                throw;
            }
        }

        public async Task<Category> UpdateCategory(Guid id, CategoryDTO categoryDTO)
        {
            _logger.Info($"Updating category with ID: {id}");

            if (categoryDTO == null)
                throw new NullReferenceException("400 - Category data cannot be null.");

            try
            {
                var category = await _unitOfWork.CategoryGenericRepository.GetByIdAsync(id);
                if (category == null)
                {
                    _logger.Warn($"Category with ID: {id} not found.");
                    throw new KeyNotFoundException("400 - Category not found.");
                }

                _mapper.Map(categoryDTO, category);
                await _unitOfWork.CategoryGenericRepository.Update(category);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Category updated successfully.");
                return category;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during category update: {ex.Message}");
                throw;
            }
        }

        public async Task<Category> DeleteCategory(Guid categoryId)
        {
            _logger.Info($"Deleting category with ID: {categoryId}");
            try
            {
                var category = await _unitOfWork.CategoryGenericRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    _logger.Warn($"Category with ID: {categoryId} not found.");
                    throw new KeyNotFoundException("400 - Category not found.");
                }

                await _unitOfWork.CategoryGenericRepository.SoftRemove(category);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Category deleted successfully.");
                return category;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during category deletion: {ex.Message}");
                throw;
            }
        }
    }
}
