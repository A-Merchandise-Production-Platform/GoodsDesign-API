using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class FactoryOrder : BaseEntity
    {
        public Guid FactoryId { get; set; }
        public string Status { get; set; } // Enum: Received, In Production, etc.
        public DateTime EstimatedCompletionDate { get; set; }
        public int TotalItems { get; set; }
        public decimal TotalProductionCost { get; set; }

        // Navigation property
        public Factory Factory { get; set; }
    }
}
