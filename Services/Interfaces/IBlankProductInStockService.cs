using BusinessObjects.Entities;
using DataTransferObjects.BlankProductInStockDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IBlankProductInStockService
    {
        Task<BlankProductInStock> CreateBlankProductInStock(BlankProductInStockDTO dto);
        Task<BlankProductInStock> DeleteBlankProductInStock(Guid id);
        Task<BlankProductInStock> GetBlankProductInStockById(Guid id);
        Task<BlankProductInStock> UpdateBlankProductInStock(Guid id, BlankProductInStockDTO blankProductDTO);
    }
}
