using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class OrderHistory : BaseEntity
    {
        public Guid CustomerOrderId { get; set; }
        public string Status { get; set; } // Enum: Pending, In Production, etc.
        public DateTime Timestamp { get; set; }
        public string Note { get; set; }

        // Navigation property
        public CustomerOrder CustomerOrder { get; set; }
    }
}
