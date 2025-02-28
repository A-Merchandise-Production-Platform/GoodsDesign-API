using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.DesignPositionDTOs
{
    public class AddDesignPositionDTO
    {
        public Guid ProductDesignId { get; set; }
        public Guid ProductPositionTypeId { get; set; }
        public string? DesignJSON { get; set; }
    }
}
