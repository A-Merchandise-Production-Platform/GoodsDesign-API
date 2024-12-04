using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.UserDTOs
{
    public class UserCreateDTO
    {
        public string Email { get; set; } = "default@gmail.com";
        public string? Password { get; set; } = "123456";
        public string? UserName { get; set; } = "default name";
        public string? PhoneNumber { get; set; } = "0909090909";
        public bool? Gender { get; set; } = true;
        public DateTime? DateOfBirth { get; set; } = DateTime.UtcNow.AddYears(-18);
        public string? ImageUrl { get; set; }
    }
}
