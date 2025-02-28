using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

public class DesignPositionRepository : IDesignPositionRepository
{
    private readonly GoodsDesignDbContext _context;

    public DesignPositionRepository(
        GoodsDesignDbContext context
        )
    {
        _context = context;
    
    }

    public async Task<DesignPosition?> GetByCompositeKeyAsync(
        Guid productDesignId,
        Guid productPositionTypeId)
    {
        // Tìm 1 record DesignPosition theo composite key
        return await _context.DesignPositions
            .FindAsync(productDesignId, productPositionTypeId);
    }

    public async Task<DesignPosition> AddAsync(DesignPosition designPosition)
    {
        // Nếu bạn muốn có CreatedAt, CreatedBy, 
        // cần thêm thủ công vì DesignPosition không kế thừa BaseEntity
        // (Chỉ làm nếu bạn muốn tương tự BaseEntity)
        // designPosition.CreatedAt = _currentTime.GetCurrentTime();
        // designPosition.CreatedBy = _claimsService.GetCurrentUserId;

        var result = await _context.DesignPositions.AddAsync(designPosition);
        // Không gọi SaveChanges tại repo -> gọi ở UnitOfWork hoặc Service
        return result.Entity;
    }

    public async Task<bool> UpdateAsync(DesignPosition designPosition)
    {
        // designPosition.UpdatedAt = _currentTime.GetCurrentTime();
        // designPosition.UpdatedBy = _claimsService.GetCurrentUserId;

        _context.DesignPositions.Update(designPosition);
        return true;
    }

    public async Task<bool> HardDeleteAsync(Guid productDesignId, Guid productPositionTypeId)
    {
        var dp = await _context.DesignPositions.FindAsync(productDesignId, productPositionTypeId);
        if (dp == null) return false;

        _context.DesignPositions.Remove(dp);
        return true;
    }
}
