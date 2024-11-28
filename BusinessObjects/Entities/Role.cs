using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities
{
    public class Role : IdentityRole<Guid>
    {
        public virtual ICollection<User> Users { get; set; }
    }
}
