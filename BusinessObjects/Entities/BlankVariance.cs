﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class BlankVariance : BaseEntity
    {
        public Guid ProductId { get; set; }
        public string Information { get; set; } // JSONB equivalent
        public string BlankPrice { get; set; }

        // Navigation property
        public Product Product { get; set; }
        public virtual ICollection<FactoryProduct> FactoryProducts { get; set; } // Many-to-Many through FactoryProduct
        public ICollection<ProductDesign> ProductDesigns { get; set; } = new List<ProductDesign>();

    }
}
