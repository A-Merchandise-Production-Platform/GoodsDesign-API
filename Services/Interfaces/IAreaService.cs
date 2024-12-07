using BusinessObjects.Entities;
using DataTransferObjects.AreaDTOs;

namespace Services.Interfaces
{
    public interface IAreaService
    {
        Task<List<Area>> GetAreas();
        Task<Area> GetArea();
        Task<AreaDTO> CreateArea(AreaDTO areaDTO);
        Task<AreaDTO> UpdateArea(Guid id, AreaDTO areaDTO);
        Task<AreaDTO> DeleteArea(Guid areaId);
    }
}
