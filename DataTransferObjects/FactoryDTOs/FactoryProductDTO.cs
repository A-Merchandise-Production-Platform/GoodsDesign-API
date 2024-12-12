using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.FactoryDTOs
{
    public class FactoryProductDTO
    {
        public Guid FactoryId { get; set; }
        public Guid ProductId { get; set; }
        public int ProductionCapacity { get; set; }
        public int EstimatedProductionTimwe { get; set; }
    }
}
