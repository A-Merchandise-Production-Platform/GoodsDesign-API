using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IFactoryProductService
    {
        Task<FactoryProduct> AddFactoryProduct(FactoryProductDTO factoryProductDTO);
    }
}
