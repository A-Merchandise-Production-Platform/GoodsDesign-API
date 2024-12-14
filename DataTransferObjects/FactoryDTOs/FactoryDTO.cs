using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.FactoryDTOs
{
    public class FactoryDTO
    {
        public Guid? FactoryOwnerId { get; set; }
        public string Information { get; set; } // JSONB equivalent
        public string Contract { get; set; } // JSONB equivalent
        public bool IsActive { get; set; } = false;

    }
}
