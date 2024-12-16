using BusinessObjects.Entities;
using DataTransferObjects.ProductPositionTypeDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IProductPositionTypeService
    {
        Task<ProductPositionType> CreateProductPositionType(ProductPositionTypeDTO dto);
        Task<ProductPositionType> DeleteProductPositionType(Guid id);
        Task<ProductPositionType> GetProductPositionTypeById(Guid id);
        Task<ProductPositionType> UpdateProductPositionType(Guid id, ProductPositionTypeDTO dto);
    }
}
