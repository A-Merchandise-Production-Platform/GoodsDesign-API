using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class CustomerOrderDetail : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid DesignId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }

        // Navigation properties
        public CustomerOrder CustomerOrder { get; set; }
        public ProductDesign ProductDesign { get; set; }
    }
}
