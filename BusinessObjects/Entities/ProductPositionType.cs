using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class ProductPositionType : BaseEntity
    {
        public Guid ProductId { get; set; }
        public string PositionName { get; set; }
        public decimal BasePrice { get; set; }

        // Navigation property
        public Product Product { get; set; }
    }
}
