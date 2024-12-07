using AutoMapper;
using BusinessObjects;
using BusinessObjects.Entities;
using DataTransferObjects.AreaDTOs;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;

namespace Services.Services
{
    public class AreaService : IAreaService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly GoodsDesignDbContext _context;

        public AreaService(ILoggerService logger, IMapper mapper, GoodsDesignDbContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        public async Task<AreaDTO> CreateArea(AreaDTO areaDTO)
        {
            _logger.Info("Create area attempt initiated.");
            try
            {
                var area = _mapper.Map<Area>(areaDTO);
                await _context.Areas.AddAsync(area);
                await _context.SaveChangesAsync();
                _logger.Success("Area created successfully.");
                return _mapper.Map<AreaDTO>(area);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area creation: {ex.Message}");
                throw;
            }
        }

        public async Task<AreaDTO> DeleteArea(Guid areaId)
        {
            _logger.Info("Delete area attempt initiated.");
            try
            {
                var area = await _context.Areas.FirstOrDefaultAsync(a => a.Id == areaId);
                if (area == null)
                {
                    _logger.Warn("Area not found.");
                    throw new Exception("404 - Area not found.");
                }

                _context.Areas.Remove(area);
                await _context.SaveChangesAsync();
                _logger.Success("Area deleted successfully.");
                return _mapper.Map<AreaDTO>(area);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area deletion: {ex.Message}");
                throw;
            }
        }

        public async Task<Area> GetArea(Guid areaId)
        {
            _logger.Info("Get area attempt initiated.");
            try
            {
                var area = await _context.Areas.FirstOrDefaultAsync(a => a.Id == areaId);
                if (area == null)
                {
                    _logger.Warn("Area not found.");
                    throw new Exception("404 - Area not found.");
                }

                _logger.Success("Area retrieved successfully.");
                return area;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area retrieval: {ex.Message}");
                throw;
            }
        }

        public Task<Area> GetArea()
        {
            throw new NotImplementedException();
        }

        public async Task<List<Area>> GetAreas()
        {
            _logger.Info("Get areas attempt initiated.");
            try
            {
                var areas = await _context.Areas.ToListAsync();
                _logger.Success("Areas retrieved successfully.");
                return areas;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during areas retrieval: {ex.Message}");
                throw;
            }
        }

        public async Task<AreaDTO> UpdateArea(Guid id, AreaDTO areaDTO)
        {
            _logger.Info("Update area attempt initiated.");
            try
            {
                var area = await _context.Areas.FirstOrDefaultAsync(a => a.Id == id);
                if (area == null)
                {
                    _logger.Warn("Area not found.");
                    throw new Exception("404 - Area not found.");
                }

                _mapper.Map(areaDTO, area);
                _context.Areas.Update(area);
                await _context.SaveChangesAsync();
                _logger.Success("Area updated successfully.");
                return _mapper.Map<AreaDTO>(area);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during area update: {ex.Message}");
                throw;
            }
        }
    }
}
