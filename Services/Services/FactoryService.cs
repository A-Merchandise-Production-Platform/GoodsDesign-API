using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using System.Text.Json;

namespace Services.Services
{
    public class FactoryService : IFactoryService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;

        public FactoryService(ILoggerService logger, IMapper mapper, IUnitOfWork unitOfWork, IUserService userService)
        {
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _userService = userService;
        }

        public async Task<Factory> CreateFactory(FactoryCreateDTO factoryDTO)
        {
            _logger.Info("Create factory attempt initiated.");
            try
            {
                var owner = await _userService.GetCurrentUser(factoryDTO.FactoryOwnerId.ToString());
                if (owner == null)
                {
                    _logger.Warn($"User with ID: {factoryDTO.FactoryOwnerId} not found.");
                    throw new KeyNotFoundException("400 - User (FactoryOwner) not found. Cannot create factory.");
                }

                // Gom các field thành JSON cho "Information"
                var informationJson = new
                {
                    FactoryName = factoryDTO.FactoryName,
                    FactoryContactPerson = factoryDTO.FactoryContactPerson,
                    FactoryContactPhone = factoryDTO.FactoryContactPhone,
                    FactoryAddress = factoryDTO.FactoryAddress
                };

                // Gom các field thành JSON cho "Contract"
                var contractJson = new
                {
                    ContractName = factoryDTO.ContractName,
                    ContractPaperUrl = factoryDTO.ContractPaperUrl
                };

                var factory = new Factory
                {
                    FactoryOwnerId = factoryDTO.FactoryOwnerId.Value,
                    Information = JsonSerializer.Serialize(informationJson), // Serialize object to JSON string
                    Contract = JsonSerializer.Serialize(contractJson), // Serialize object to JSON string
                    IsActive = false,
                    FactoryProducts = new List<FactoryProduct>()
                };

                if (factoryDTO.SelectedProducts != null && factoryDTO.SelectedProducts.Any())
                {
                    foreach (var selectedProduct in factoryDTO.SelectedProducts)
                    {
                        // Kiểm tra sản phẩm có tồn tại không
                        var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(selectedProduct.ProductId);
                        if (product == null)
                        {
                            _logger.Warn($"Product with ID: {selectedProduct.ProductId} not found. Skipping this product.");
                            continue;
                        }

                        // Thêm FactoryProduct vào danh sách
                        factory.FactoryProducts.Add(new FactoryProduct
                        {
                            Factory = factory,
                            //BlankVariance = product,
                            ProductionCapacity = selectedProduct.ProductionCapacity ?? 0,
                            EstimatedProductionTimwe = selectedProduct.EstimatedProductionTime ?? 0
                        });
                    }
                }

                var result = await _unitOfWork.FactoryRepository.AddAsync(factory);
                await _unitOfWork.SaveChangesAsync();
                _logger.Success("Factory created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during factory creation: {ex.Message}");
                throw;
            }
        }


        public async Task<Factory> CreateFactory(FactoryDTO factoryDTO)
        {
            _logger.Info("Create factory attempt initiated.");
            try
            {
                var owner = await _userService.GetCurrentUser(factoryDTO.FactoryOwnerId.ToString());
                if (owner == null)
                {
                    _logger.Warn($"User with ID: {factoryDTO.FactoryOwnerId} not found.");
                    throw new KeyNotFoundException("400 - User (FactoryOwner) not found. Cannot create factory.");
                }



                var factory = new Factory
                {
                    FactoryOwnerId = factoryDTO.FactoryOwnerId.Value,
                    Information = factoryDTO.Information, // Serialize object to JSON string
                    Contract = factoryDTO.Contract, // Serialize object to JSON string
                    IsActive = false,
                    //FactoryProducts = new List<FactoryProduct>()

                };



                var result = await _unitOfWork.FactoryRepository.AddAsync(factory);
                await _unitOfWork.SaveChangesAsync();
                _logger.Success("Factory created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during factory creation: {ex.Message}");
                throw;
            }
        }
        public async Task<Factory> UpdateFactory(Guid id, FactoryDTO factoryDTO)
        {
            _logger.Info($"Updating factory with ID: {id}");

            if (factoryDTO == null)
                throw new NullReferenceException("400 - Factory data cannot be null.");

            try
            {
                var factory = await _unitOfWork.FactoryRepository.GetByIdAsync(id);
                if (factory == null)
                {
                    _logger.Warn($"Factory with ID: {id} not found.");
                    throw new KeyNotFoundException("404 - Factory not found.");
                }

                if (factoryDTO.FactoryOwnerId.HasValue)
                {
                    var owner = await _userService.GetCurrentUser(factoryDTO.FactoryOwnerId.Value.ToString());
                    if (owner == null)
                    {
                        _logger.Warn($"User with ID: {factoryDTO.FactoryOwnerId} not found.");
                        throw new KeyNotFoundException("400 - FactoryOwner not found. Cannot update.");
                    }
                }

                _mapper.Map(factoryDTO, factory);
                await _unitOfWork.FactoryRepository.Update(factory);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Factory updated successfully.");
                return factory;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during factory update: {ex.Message}");
                throw;
            }
        }

        public async Task<Factory> DeleteFactory(Guid factoryId)
        {
            _logger.Info($"Deleting factory with ID: {factoryId}");
            try
            {
                var factory = await _unitOfWork.FactoryRepository.GetByIdAsync(factoryId);
                if (factory == null)
                {
                    _logger.Warn($"Factory with ID: {factoryId} not found.");
                    throw new KeyNotFoundException("404 - Factory not found.");
                }

                await _unitOfWork.FactoryRepository.SoftRemove(factory);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Factory deleted successfully.");
                return factory;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during factory deletion: {ex.Message}");
                throw;
            }
        }

        public async Task<Factory> UpdateActiveStatusFactory(Guid factoryId)
        {
            _logger.Info($"Approve factory with ID: {factoryId}");
            try
            {
                var factory = await _unitOfWork.FactoryRepository.GetByIdAsync(factoryId);
                if (factory == null)
                {
                    _logger.Warn($"Factory with ID: {factoryId} not found.");
                    throw new KeyNotFoundException("404 - Factory not found.");
                }
                factory.IsActive = !factory.IsActive;
                if (factory.IsActive.Value)
                {
                    var owner = await _userService.GetCurrentUser(factory.FactoryOwnerId.ToString());
                    if (owner == null)
                    {
                        _logger.Warn($"User with ID: {factory.FactoryOwnerId} not found.");
                        throw new KeyNotFoundException("400 - User (FactoryOwner) not found. Cannot approve this factory owner.");
                    }
                    if (!owner.IsActive)
                    {
                        await _userService.UpdateActiveStatusUser(factory.FactoryOwnerId);
                    }

                }

                await _unitOfWork.FactoryRepository.Update(factory);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Factory has been approved to be activated successfully.");
                return factory;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during factory deletion: {ex.Message}");
                throw;
            }
        }


    }
}
