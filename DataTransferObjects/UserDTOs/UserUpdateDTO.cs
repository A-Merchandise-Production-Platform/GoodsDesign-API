using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.UserDTOs
{
    public class UserUpdateDTO
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }

        public string? Password { get; set; } // allow update password

        public string? PhoneNumber { get; set; }
        public bool? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; }
        public List<AddressModel>? Addresses { get; set; }

    }
}
