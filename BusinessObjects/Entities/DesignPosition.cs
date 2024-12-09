using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class DesignPosition : BaseEntity
    {
        public Guid ProductDesignId { get; set; }
        public Guid ProductPositionTypeId { get; set; }

        // Navigation properties
        public ProductDesign ProductDesign { get; set; }
        public ProductPositionType ProductPositionType { get; set; }
    }
}
