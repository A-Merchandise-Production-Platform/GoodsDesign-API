using AutoMapper;
using BusinessObjects;
using BusinessObjects.Entities;
using DataTransferObjects.AreaDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services
{
    public class AreaService : IAreaService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly GoodsDesignDbContext _context;
        private readonly IUnitOfWork _unitOfWork;


        public AreaService(ILoggerService logger, IMapper mapper, GoodsDesignDbContext context, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
            _unitOfWork = unitOfWork;
        }

        public async Task<Area> CreateArea(AreaDTO areaDTO)
        {
            _logger.Info("Create area attempt initiated.");
            try
            {
                var param = _mapper.Map<Area>(areaDTO);
                var result = await _unitOfWork.AreaGenericRepository.AddAsync(param);
                await _context.SaveChangesAsync();
                _logger.Success("Area created successfully.");
                return _mapper.Map<Area>(result);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area creation: {ex.Message}");
                throw;
            }
        }

        public async Task<Area> DeleteArea(Guid areaId)
        {
            _logger.Info($"Deleting area with ID: {areaId}");

            try
            {
                var area = await _unitOfWork.AreaGenericRepository.GetByIdAsync(areaId);
                if (area == null)
                {
                    _logger.Warn($"Area with ID: {areaId} not found.");
                    throw new KeyNotFoundException("400 - Area not found.");
                }

                await _unitOfWork.AreaGenericRepository.SoftRemove(area);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Area deleted successfully.");
                return _mapper.Map<Area>(area);
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during area deletion: {ex.Message}");
                throw;
            }
        }

        public async Task<Area> UpdateArea(Guid id, AreaDTO areaDTO)
        {
            _logger.Info($"Updating area with ID: {id}");

            if (areaDTO == null)
                throw new NullReferenceException("400 - Area data cannot be null.");

            try
            {
                var area = await _unitOfWork.AreaGenericRepository.GetByIdAsync(id);
                if (area == null)
                {
                    _logger.Warn($"Area with ID: {id} not found.");
                    throw new KeyNotFoundException("400 - Area not found.");
                }

                _mapper.Map(areaDTO, area);
                await _unitOfWork.AreaGenericRepository.Update(area);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Area updated successfully.");
                return _mapper.Map<Area>(area);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area update: {ex.Message}");
                throw;
            }
        }
    }
}
