using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class ProductionFlow : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? CustomerOrderId { get; set; }
        public Guid ManagerId { get; set; }
        public string Status { get; set; } // Enum: Pending, In Progress, Completed
        public DateTime StartDate { get; set; }
        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        public CustomerOrder CustomerOrder { get; set; }
        public User Manager { get; set; }
    }
}
