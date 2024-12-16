using BusinessObjects.Entities;
using DataTransferObjects.ProductVarianceDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Services.Services
{
    public class ProductVarianceService : IProductVarianceService
    {

        private readonly ILoggerService _logger;
        private readonly IUnitOfWork _unitOfWork;

        public ProductVarianceService(ILoggerService logger, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
        }


        public async Task<ProductVariance> CreateProductVariance(ProductVarianceDTO dto)
        {
            _logger.Info("Creating Product Variance...");
            try
            {
                var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(dto.ProductId);
                if (product == null)
                {
                    _logger.Warn($"Product with ID {dto.ProductId} not found.");
                    throw new KeyNotFoundException("404 - Product not found.");
                }

                var productVariance = new ProductVariance
                {
                    ProductId = dto.ProductId,
                    Information = JsonSerializer.Serialize(dto.Information),
                    BlankPrice = dto.BlankPrice
                };

                var result = await _unitOfWork.ProductVarianceRepository.AddAsync(productVariance);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Product Variance created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during Product Variance creation: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductVariance> UpdateProductVariance(Guid id, ProductVarianceDTO dto)
        {
            _logger.Info($"Updating Product Variance with ID: {id}");
            try
            {
                var productVariance = await _unitOfWork.ProductVarianceRepository.GetByIdAsync(id);
                if (productVariance == null)
                {
                    _logger.Warn($"Product Variance with ID {id} not found.");
                    throw new KeyNotFoundException("404 - Product Variance not found.");
                }

                var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(dto.ProductId);
                if (product == null)
                {
                    _logger.Warn($"Product with ID {dto.ProductId} not found.");
                    throw new KeyNotFoundException("404 - Product not found.");
                }

                productVariance.ProductId = dto.ProductId;
                productVariance.Information = JsonSerializer.Serialize(dto.Information);
                productVariance.BlankPrice = dto.BlankPrice;

                await _unitOfWork.ProductVarianceRepository.Update(productVariance);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Product Variance updated successfully.");
                return productVariance;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during Product Variance update: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductVariance> DeleteProductVariance(Guid id)
        {
            _logger.Info($"Deleting Product Variance with ID: {id}");
            try
            {
                var productVariance = await _unitOfWork.ProductVarianceRepository.GetByIdAsync(id);
                if (productVariance == null)
                {
                    _logger.Warn($"Product Variance with ID {id} not found.");
                    throw new KeyNotFoundException("404 - Product Variance not found.");
                }

                await _unitOfWork.ProductVarianceRepository.SoftRemove(productVariance);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Product Variance deleted successfully.");
                return productVariance;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during Product Variance deletion: {ex.Message}");
                throw;
            }
        }

    }
}
