using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class DesignPosition 
    {
        public Guid ProductDesignId { get; set; }
        public Guid ProductPositionTypeId { get; set; }
        public string DesignJSON { get; set; }

        // Navigation properties
        public ProductDesign ProductDesign { get; set; }
        public ProductPositionType ProductPositionType { get; set; }
    }
}
