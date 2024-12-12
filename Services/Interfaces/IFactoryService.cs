using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IFactoryService
    {
        Task<Factory> CreateFactory(FactoryDTO factoryDTO);
        Task<Factory> DeleteFactory(Guid factoryId);
        Task<Factory> UpdateActiveStatusFactory(Guid factoryId);
        Task<Factory> UpdateFactory(Guid id, FactoryDTO factoryDTO);
    }
}
