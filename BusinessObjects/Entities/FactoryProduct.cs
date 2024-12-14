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
        public Guid ProductId { get; set; }
        public int ProductionCapacity { get; set; }
        public int EstimatedProductionTimwe { get; set; }

        //Navigation properties
        public Factory Factory { get; set; }
        public Product Product { get; set; }
    }
}
