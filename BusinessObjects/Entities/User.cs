using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities
{
    public class User : IdentityUser<Guid>
    {
        public bool Gender { get; set; } = false;
        public DateTime? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; } = "";
        public bool? IsActive {  get; set; }    
        
        // One-to-Many: A user belongs to one role
        public Guid RoleId { get; set; } // Foreign Key
        public Role Role { get; set; } // Navigation Property
    }
}