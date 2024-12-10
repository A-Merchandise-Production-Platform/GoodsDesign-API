using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class TaskOrder  : BaseEntity
    {
        public Guid ParentTaskId { get; set; }

        // Navigation properties
        public ProductionTask Task { get; set; }
        public ProductionTask ParentTask { get; set; }
    }
}
