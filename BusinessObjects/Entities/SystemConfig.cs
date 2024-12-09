using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class SystemConfig : BaseEntity
    {
        public string Name { get; set; }
        public string Values { get; set; } // JSONB equivalent
    }
}
