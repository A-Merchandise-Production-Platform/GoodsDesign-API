using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class Task : BaseEntity
    {
        public Guid ProductionFlowId { get; set; }
        public string TaskName { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } // Enum: Unassigned, Assigned, etc.
        public DateTime StartDate { get; set; }
        public DateTime ExpiredTime { get; set; }

        // Navigation property
        public ProductionFlow ProductionFlow { get; set; }
        public ICollection<TaskOrder> TaskOrders { get; set; } // Task làm cha của TaskOrder
    }
}
