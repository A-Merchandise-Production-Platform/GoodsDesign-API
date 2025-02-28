using BusinessObjects.Entities;
using DataTransferObjects.DesignPositionDTOs;
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

    public async Task<DesignPosition> AddDesignPositionAsync(AddDesignPositionDTO dto)
    {
        // Tạo entity
        var designPosition = new DesignPosition
        {
            ProductDesignId = dto.ProductDesignId,
            ProductPositionTypeId = dto.ProductPositionTypeId,
            DesignJSON = dto.DesignJSON ?? string.Empty
        };

        // Gọi repo để thêm
        await _unitOfWork.DesignPositionRepository.AddAsync(designPosition);

        // Lưu CSDL
        await _unitOfWork.SaveChangesAsync();

        return designPosition;
    }
}
