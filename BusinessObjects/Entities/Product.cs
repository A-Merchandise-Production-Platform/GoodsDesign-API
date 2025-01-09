using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid CategoryId { get; set; }
        public string ImageUrl { get; set; }
        public string Model3DUrl { get; set; }

        // Navigation property
        public Category Category { get; set; }
        public virtual ICollection<FactoryProduct> FactoryProducts { get; set; } // Many-to-Many through FactoryProduct
        public virtual ICollection<ProductVariance> ProductVariances { get; set; } 

    }
}
