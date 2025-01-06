using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.BlankProductInStockDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class BlankProductInStockService : IBlankProductInStockService
    {
        private readonly ILoggerService _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BlankProductInStockService(ILoggerService logger, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BlankProductInStock> CreateBlankProductInStock(BlankProductInStockDTO dto)
        {
            _logger.Info("Creating Blank Product in Stock...");
            try
            {
                var productVariance = await _unitOfWork.ProductVarianceRepository.GetByIdAsync(dto.ProductVarianceId);
                if (productVariance == null)
                {
                    _logger.Warn($"Product Variance with ID {dto.ProductVarianceId} not found.");
                    throw new KeyNotFoundException("404 - Product Variance not found.");
                }

                var blankProduct = new BlankProductInStock
                {
                    ProductVarianceId = dto.ProductVarianceId,
                    PlaceId = dto.PlaceId,
                    QuantityInStock = dto.QuantityInStock
                };

                var result = await _unitOfWork.BlankProductInStockRepository.AddAsync(blankProduct);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Blank Product in Stock created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during Blank Product creation: {ex.Message}");
                throw;
            }
        }

        public async Task<BlankProductInStock> UpdateBlankProductInStock(Guid id, BlankProductInStockDTO blankProductDTO)
        {
            _logger.Info($"Updating Blank Product In Stock with ID: {id}");
            try
            {
                var existingProduct = await _unitOfWork.BlankProductInStockRepository.GetByIdAsync(id);
                if (existingProduct == null)
                {
                    _logger.Warn($"Blank Product with ID: {id} not found.");
                    throw new KeyNotFoundException("404 - Blank Product not found.");
                }

                _mapper.Map(blankProductDTO, existingProduct);
                await _unitOfWork.BlankProductInStockRepository.Update(existingProduct);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Blank Product In Stock updated successfully.");
                return existingProduct;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during Blank Product update: {ex.Message}");
                throw;
            }
        }

        public async Task<BlankProductInStock> DeleteBlankProductInStock(Guid id)
        {
            _logger.Info($"Deleting Blank Product In Stock with ID: {id}");
            try
            {
                var existingProduct = await _unitOfWork.BlankProductInStockRepository.GetByIdAsync(id);
                if (existingProduct == null)
                {
                    _logger.Warn($"Blank Product with ID: {id} not found.");
                    throw new KeyNotFoundException("404 - Blank Product not found.");
                }

                await _unitOfWork.BlankProductInStockRepository.SoftRemove(existingProduct);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Blank Product In Stock deleted successfully.");
                return existingProduct;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during Blank Product deletion: {ex.Message}");
                throw;
            }
        }

        public async Task<BlankProductInStock> GetBlankProductInStockById(Guid id)
        {
            _logger.Info($"Fetching Blank Product In Stock with ID: {id}");
            try
            {
                var product = await _unitOfWork.BlankProductInStockRepository.GetByIdAsync(id);
                if (product == null)
                {
                    _logger.Warn($"Blank Product with ID: {id} not found.");
                    throw new KeyNotFoundException("404 - Blank Product not found.");
                }
                return product;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during fetching Blank Product: {ex.Message}");
                throw;
            }
        }


    }
}
