using BusinessObjects.Entities;
using Repositories.Interfaces;
using Services.Interfaces;

public class DesignPositionService : IDesignPositionService
{
    private readonly IUnitOfWork _unitOfWork;

    public DesignPositionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DesignPosition?> OverwriteDesignAsync(Guid productDesignId, Guid productPositionTypeId, string designJSON)
    {
        var designPosition = await _unitOfWork.DesignPositionRepository
            .GetByCompositeKeyAsync(productDesignId, productPositionTypeId);

        if (designPosition == null)
        {
            // Tạo mới
            designPosition = new DesignPosition
            {
                ProductDesignId = productDesignId,
                ProductPositionTypeId = productPositionTypeId,
                DesignJSON = designJSON
            };
            await _unitOfWork.DesignPositionRepository.AddAsync(designPosition);
        }
        else
        {
            // Cập nhật
            designPosition.DesignJSON = designJSON;
            await _unitOfWork.DesignPositionRepository.UpdateAsync(designPosition);
        }

        await _unitOfWork.SaveChangesAsync();
        return designPosition;
    }
}
