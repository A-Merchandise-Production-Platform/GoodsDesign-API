using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities
{
    public class Role : IdentityRole<Guid>
    {
        public ICollection<User> Users { get; set; }
    }
}
