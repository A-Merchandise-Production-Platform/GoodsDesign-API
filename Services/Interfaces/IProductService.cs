using BusinessObjects.Entities;
using DataTransferObjects.ProductDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IProductService
    {
        Task<Product> CreateProduct(ProductDTO productDTO);
        Task<Product> DeleteProduct(Guid productId);
        Task<Product> UpdateProduct(Guid id, ProductDTO productDTO);
    }
}
