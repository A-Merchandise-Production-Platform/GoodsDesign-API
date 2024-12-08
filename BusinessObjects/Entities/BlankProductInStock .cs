using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class BlankProductInStock
    {
        public Guid ProductVariantId { get; set; }
        public Guid PlaceId { get; set; }
        public int QuantityInStock { get; set; }

        // Navigation properties
        public ProductVariance ProductVariance { get; set; }
       // public Area Area { get; set; }
    }
}
