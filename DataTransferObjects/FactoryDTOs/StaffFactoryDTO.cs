using BusinessObjects.Entities;
using DataTransferObjects.UserDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.FactoryDTOs
{
    public class StaffFactoryDTO
    {
        public Guid UserId { get; set; }
        public virtual UserDTO User { get; set; }
        public Guid FactoryOwnerId { get; set; }
        public FactoryDTO FactoryOwner { get; set; }

    }
}
