using BusinessObjects.Entities;
using DataTransferObjects.CategoryDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : Controller
    {
        private readonly ILoggerService _logger;
        private readonly ICategoryService _categoryService;

        public CategoriesController(ILoggerService logger, ICategoryService categoryService)
        {
            _logger = logger;
            _categoryService = categoryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDTO categoryDTO)
        {
            _logger.Info("Create category request received.");
            try
            {
                var createdCategory = await _categoryService.CreateCategory(categoryDTO);
                return Ok(ApiResult<Category>.Success(createdCategory, "Category created successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during category creation: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryDTO categoryDTO)
        {
            _logger.Info($"Update category with ID {id} request received.");
            try
            {
                var updatedCategory = await _categoryService.UpdateCategory(id, categoryDTO);
                return Ok(ApiResult<Category>.Success(updatedCategory, "Category updated successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during category update: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            _logger.Info($"Delete category with ID {id} request received.");
            try
            {
                var deletedCategory = await _categoryService.DeleteCategory(id);
                return Ok(ApiResult<Category>.Success(deletedCategory, "Category deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during category deletion: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
