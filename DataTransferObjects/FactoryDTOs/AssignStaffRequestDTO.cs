using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.FactoryDTOs
{
    public class AssignStaffRequestDTO
    {
        public Guid StaffUserId { get; set; }
        public Guid FactoryOwnerId { get; set; }
    }
}
