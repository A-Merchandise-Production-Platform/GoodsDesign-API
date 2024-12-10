using BusinessObjects.Entities;
using DataTransferObjects.CategoryDTOs;

namespace Services.Services
{
    public interface ICategoryService
    {
        Task<Category> CreateCategory(CategoryDTO categoryDTO);
        Task<Category> UpdateCategory(Guid id, CategoryDTO categoryDTO);
        Task<Category> DeleteCategory(Guid categoryId);
    }
}
