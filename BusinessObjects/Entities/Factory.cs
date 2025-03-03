using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class Factory : BaseEntity
    {
        public Guid FactoryOwnerId { get; set; }
        public bool? IsActive { get; set; } = false;

        public string Information { get; set; } // JSONB equivalent
        public string Contract { get; set; } // JSONB equivalent
        public AddressModel Address { get; set; } = new AddressModel();



        // Navigation property
        public User FactoryOwner { get; set; }
        public virtual ICollection<StaffFactory> StaffFactories { get; set; } // Many-to-Many through FactoryProduct
        public virtual ICollection<FactoryProduct> FactoryProducts { get; set; } // Many-to-Many through FactoryProduct


    }
}
