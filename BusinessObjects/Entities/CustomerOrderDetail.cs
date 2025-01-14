using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class CustomerOrderDetail : BaseEntity
    {
        public Guid CustomerOrderId { get; set; }
        public Guid? ProductDesignId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? TotalPrice { get; set; } // option, not sure to let this field exist in OrderDetail
        public int Quantity { get; set; }
        public string Status { get; set; }

        // Navigation properties
        public CustomerOrder CustomerOrder { get; set; }
        public ProductDesign? ProductDesign { get; set; }
    }
}
