using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.UserDTOs
{
    public class UserDTO
    {
        public Guid? Id { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }

        public string? PhoneNumber { get; set; }
        public bool? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; } = false;
    }
}
