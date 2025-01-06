using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.ProductPositionTypeDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services
{
    public class ProductPositionTypeService : IProductPositionTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;

        public ProductPositionTypeService(IUnitOfWork unitOfWork, ILoggerService logger, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<ProductPositionType> CreateProductPositionType(ProductPositionTypeDTO dto)
        {
            _logger.Info("Create ProductPositionType attempt initiated.");
            try
            {
                var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(dto.ProductId);
                if (product == null)
                {
                    _logger.Warn($"Product with ID: {dto.ProductId} not found.");
                    throw new KeyNotFoundException("400 - Product not found. Cannot create.");
                }

                var productPositionType = _mapper.Map<ProductPositionType>(dto);
                var result = await _unitOfWork.ProductPositionTypeRepository.AddAsync(productPositionType);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("ProductPositionType created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during creation: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductPositionType> UpdateProductPositionType(Guid id, ProductPositionTypeDTO dto)
        {
            _logger.Info($"Update ProductPositionType with ID: {id} attempt initiated.");
            try
            {
                var existing = await _unitOfWork.ProductPositionTypeRepository.GetByIdAsync(id);
                if (existing == null)
                    throw new KeyNotFoundException("404 - ProductPositionType not found.");

                _mapper.Map(dto, existing);
                await _unitOfWork.ProductPositionTypeRepository.Update(existing);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("ProductPositionType updated successfully.");
                return existing;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during update: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductPositionType> DeleteProductPositionType(Guid id)
        {
            _logger.Info($"Delete ProductPositionType with ID: {id} attempt initiated.");
            try
            {
                var existing = await _unitOfWork.ProductPositionTypeRepository.GetByIdAsync(id);
                if (existing == null)
                    throw new KeyNotFoundException("404 - ProductPositionType not found.");

                await _unitOfWork.ProductPositionTypeRepository.SoftRemove(existing);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("ProductPositionType deleted successfully.");
                return existing;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during deletion: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductPositionType> GetProductPositionTypeById(Guid id)
        {
            _logger.Info($"Fetch ProductPositionType with ID: {id}");
            return await _unitOfWork.ProductPositionTypeRepository.GetByIdAsync(id);
        }

 
    }
}
