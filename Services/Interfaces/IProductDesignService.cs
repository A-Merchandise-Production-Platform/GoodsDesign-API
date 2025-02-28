using BusinessObjects.Entities;
using DataTransferObjects.ProductDesignDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IProductDesignService
    {
        Task<ProductDesign> CreateProductDesign(ProductDesignCreateDTO dto);
        Task<ProductDesign> GetById(Guid id);
        Task<ProductDesignDTO> PatchProductDesignAsync(Guid id, ProductDesignUpdateDTO dto);
    }
}
