using BusinessObjects.Entities;
using DataTransferObjects.DesignPositionDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IDesignPositionService
    {
        Task<DesignPosition> AddDesignPositionAsync(AddDesignPositionDTO dto);
        Task<DesignPosition?> OverwriteDesignAsync(Guid productDesignId, Guid productPositionTypeId, string designJSON);
    }
}
