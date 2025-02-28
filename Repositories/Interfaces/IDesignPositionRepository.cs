using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IDesignPositionRepository
    {
        Task<DesignPosition> AddAsync(DesignPosition designPosition);
        Task<DesignPosition?> GetByCompositeKeyAsync(Guid productDesignId, Guid productPositionTypeId);
        Task<bool> HardDeleteAsync(Guid productDesignId, Guid productPositionTypeId);
        Task<bool> UpdateAsync(DesignPosition designPosition);
    }
}
