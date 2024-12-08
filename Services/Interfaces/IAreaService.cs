using BusinessObjects.Entities;
using DataTransferObjects.AreaDTOs;

namespace Services.Interfaces
{
    public interface IAreaService
    {
        Task<Area> CreateArea(AreaDTO areaDTO);
        Task<Area> UpdateArea(Guid id, AreaDTO areaDTO);
        Task<Area> DeleteArea(Guid areaId);
    }
}
