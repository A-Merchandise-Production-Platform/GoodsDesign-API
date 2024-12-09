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
        public Task Task { get; set; }
        public Task ParentTask { get; set; }
    }
}
