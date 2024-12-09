using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class StaffTask : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid TaskId { get; set; }
        public string Address { get; set; } // JSONB equivalent
        public DateTime AssignedDate { get; set; }
        public string Note { get; set; }
        public string Status { get; set; } // Enum: Pending, In Progress, etc.
        public DateTime? CompletedDate { get; set; }

        // Navigation properties
        public User User { get; set; }
        public Task Task { get; set; }
    }
}
