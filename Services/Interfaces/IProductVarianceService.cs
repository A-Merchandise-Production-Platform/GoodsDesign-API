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
        Task<BlankVariance> CreateProductVariance(ProductVarianceDTO dto);
        Task<BlankVariance> DeleteProductVariance(Guid id);
        Task<BlankVariance> UpdateProductVariance(Guid id, ProductVarianceDTO dto);
    }
}
