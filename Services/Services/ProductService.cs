using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.ProductDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services
{
    public class ProductService : IProductService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(ILoggerService logger, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<Product> CreateProduct(ProductDTO productDTO)
        {
            _logger.Info("Create product attempt initiated.");
            try
            {
                var category = await _unitOfWork.CategoryGenericRepository.GetByIdAsync(productDTO.CategoryId.Value);
                if(category == null)
                {
                    _logger.Warn($"Category with ID: {productDTO.CategoryId} not found.");
                    throw new KeyNotFoundException("400 - Category not found. cannot create");
                }

                var product = _mapper.Map<Product>(productDTO);
                var result = await _unitOfWork.ProductGenericRepository.AddAsync(product);
                await _unitOfWork.SaveChangesAsync();
                _logger.Success("Product created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during product creation: {ex.Message}");
                throw;
            }
        }

        public async Task<Product> UpdateProduct(Guid id, ProductDTO productDTO)
        {
            _logger.Info($"Updating product with ID: {id}");

            if (productDTO == null)
                throw new NullReferenceException("400 - Product data cannot be null.");

            try
            {
                var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(id);
                if (product == null)
                {
                    _logger.Warn($"Product with ID: {id} not found.");
                    throw new KeyNotFoundException("404 - Product not found.");
                }

                if (productDTO.CategoryId.HasValue)
                {
                    var category = await _unitOfWork.CategoryGenericRepository.GetByIdAsync(productDTO.CategoryId.Value);

                    if (category == null)
                    {
                        _logger.Warn($"Category with ID: {productDTO.CategoryId} not found.");
                        throw new KeyNotFoundException("400 - Category not found cannot update.");
                    }
                }

                _mapper.Map(productDTO, product);
                await _unitOfWork.ProductGenericRepository.Update(product);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Product updated successfully.");
                return product;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during product update: {ex.Message}");
                throw;
            }
        }

        public async Task<Product> DeleteProduct(Guid productId)
        {
            _logger.Info($"Deleting product with ID: {productId}");
            try
            {
                var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(productId);
                if (product == null)
                {
                    _logger.Warn($"Product with ID: {productId} not found.");
                    throw new KeyNotFoundException("404 - Product not found.");
                }

                await _unitOfWork.ProductGenericRepository.SoftRemove(product);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Product deleted successfully.");
                return product;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during product deletion: {ex.Message}");
                throw;
            }
        }
    }
}
