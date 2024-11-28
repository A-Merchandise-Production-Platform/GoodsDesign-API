using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities
{
    public class User : IdentityUser<Guid>
    {
        public bool Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; } = "";
    }
}