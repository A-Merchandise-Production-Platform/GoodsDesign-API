using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
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
    public class FactoryProductService : IFactoryProductService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public FactoryProductService(ILoggerService logger, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<FactoryProduct> AddFactoryProduct(FactoryProductDTO factoryProductDTO)
        {
            _logger.Info("Adding FactoryProduct initiated.");
            try
            {
                // Check Factory existence
                var factory = await _unitOfWork.FactoryRepository.GetByIdAsync(factoryProductDTO.FactoryId);
                if (factory == null)
                {
                    _logger.Warn($"Factory with ID: {factoryProductDTO.FactoryId} not found.");
                    throw new KeyNotFoundException("400 - Factory not found. Cannot add FactoryProduct.");
                }

                // Check Product existence
                var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(factoryProductDTO.ProductId);
                if (product == null)
                {
                    _logger.Warn($"Product with ID: {factoryProductDTO.ProductId} not found.");
                    throw new KeyNotFoundException("400 - Product not found. Cannot add FactoryProduct.");
                }

                // Map and Add FactoryProduct
                var factoryProduct = _mapper.Map<FactoryProduct>(factoryProductDTO);
                var result = await _unitOfWork.FactoryProductRepository.AddAsync(factoryProduct);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("FactoryProduct added successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during FactoryProduct addition: {ex.Message}");
                throw;
            }
        }

        //public async Task<FactoryProduct> UpdateFactoryProduct(Guid factoryId, Guid productId, FactoryProductDTO factoryProductDTO)
        //{
        //    _logger.Info($"Updating FactoryProduct with FactoryID: {factoryId} and ProductID: {productId}");
        //    try
        //    {
        //        var factoryProduct = await _unitOfWork.FactoryProductRepository.GetByCompositeKeyAsync(factoryId, productId);
        //        if (factoryProduct == null)
        //        {
        //            _logger.Warn($"FactoryProduct with FactoryID: {factoryId} and ProductID: {productId} not found.");
        //            throw new KeyNotFoundException("404 - FactoryProduct not found.");
        //        }

        //        _mapper.Map(factoryProductDTO, factoryProduct);
        //        await _unitOfWork.FactoryProductRepository.Update(factoryProduct);
        //        await _unitOfWork.SaveChangesAsync();

        //        _logger.Success("FactoryProduct updated successfully.");
        //        return factoryProduct;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error($"500 - Error during FactoryProduct update: {ex.Message}");
        //        throw;
        //    }
        //}

        //public async Task<bool> RemoveFactoryProduct(Guid factoryId, Guid productId)
        //{
        //    _logger.Info($"Removing FactoryProduct with FactoryID: {factoryId} and ProductID: {productId}");
        //    try
        //    {
        //        var factoryProduct = await _unitOfWork.FactoryProductRepository.GetByCompositeKeyAsync(factoryId, productId);
        //        if (factoryProduct == null)
        //        {
        //            _logger.Warn($"FactoryProduct with FactoryID: {factoryId} and ProductID: {productId} not found.");
        //            throw new KeyNotFoundException("404 - FactoryProduct not found.");
        //        }

        //        await _unitOfWork.FactoryProductRepository.Delete(factoryProduct);
        //        await _unitOfWork.SaveChangesAsync();

        //        _logger.Success("FactoryProduct removed successfully.");
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error($"500 - Error during FactoryProduct removal: {ex.Message}");
        //        throw;
        //    }
        //}
    }
}
