﻿using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities
{
    public class User : IdentityUser<Guid>
    {
        public bool Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; } = "";

        // One-to-Many: A user belongs to one role
        public Guid RoleId { get; set; } // Foreign Key
        public Role Role { get; set; } // Navigation Property
    }
}