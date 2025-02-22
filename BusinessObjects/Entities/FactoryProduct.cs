using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class FactoryProduct : BaseEntity
    {
        public Guid FactoryId { get; set; }
        public Guid BlankVarianceId { get; set; } // Chỉ định nhà máy phụ trách phôi cụ thể
        public int ProductionCapacity { get; set; }
        public int EstimatedProductionTimwe { get; set; }

        //Navigation properties
        public Factory Factory { get; set; }
        public BlankVariance BlankVariance { get; set; }
    }
}
