using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class FactoryOrderDetail : BaseEntity
    {
        public Guid FactoryOrderId { get; set; }
        public Guid ProductDesignId { get; set; }
        public Guid CustomerOrderDetailId { get; set; }
        public decimal ProductionCost { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }

        // Navigation properties
        public FactoryOrder FactoryOrder { get; set; }
        public ProductDesign ProductDesign { get; set; }
        public CustomerOrderDetail CustomerOrderDetail { get; set; }
    }
}
