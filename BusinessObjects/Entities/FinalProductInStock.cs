using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class FinalProductInStock : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid ProductDesignId { get; set; }
        public Guid PlaceId { get; set; }
        public int QuantityInStock { get; set; }

        // Navigation properties
        //public CustomerOrder CustomerOrder { get; set; }
        //public ProductDesign ProductDesign { get; set; }
        //public Area Area { get; set; }
    }
}
