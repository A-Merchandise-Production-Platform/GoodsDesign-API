using BusinessObjects.Entities;
using DataTransferObjects.ProductVarianceDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IProductVarianceService
    {
        Task<ProductVariance> CreateProductVariance(ProductVarianceDTO dto);
        Task<ProductVariance> DeleteProductVariance(Guid id);
        Task<ProductVariance> UpdateProductVariance(Guid id, ProductVarianceDTO dto);
    }
}
