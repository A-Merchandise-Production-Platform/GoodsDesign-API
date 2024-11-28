using BusinessObjects.Entities; // Include your namespace for the custom User entity
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;

        public SystemController(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
        {
            try
            {
                // Remove all users
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    await _userManager.DeleteAsync(user);
                }

                // Remove all roles
                var roles = _roleManager.Roles.ToList();
                foreach (var role in roles)
                {
                    await _roleManager.DeleteAsync(role);
                }

                // Seed roles: admin, manager, staff, factoryOwner, customer
                var roleNames = new[] { "admin", "manager", "staff", "factoryOwner", "customer" };
                foreach (var roleName in roleNames)
                {
                    if (!await _roleManager.RoleExistsAsync(roleName))
                    {
                        await _roleManager.CreateAsync(new IdentityRole<Guid> { Name = roleName });
                    }
                }

                // Create an admin user and assign to admin role
                var adminUser = new User
                {
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    EmailConfirmed = true,
                    Gender = true,
                    DateOfBirth = new DateTime(1990, 1, 1).ToUniversalTime(),
                    ImageUrl = "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/430878538_2206677789683723_4464660377243750146_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeE_Vr1x6BHZ_S__ovdDg7zS5W9udhABzaHlb252EAHNoS38q_urtNeTErRYpa0zqYNo-vOAf49-zjjLBslYOw-p&_nc_ohc=-pR_sm46Xo0Q7kNvgENuKqW&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AyOScuqnRIdDJw0yqlJ1OJE&oh=00_AYBRYtKe7HUGoF1imuyPohv5Wi3mnCKz-GF0YsTBc9lMzw&oe=674E895B"
                };

                var adminPassword = "123456";
                var result = await _userManager.CreateAsync(adminUser, adminPassword);

                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Failed to create admin user", errors = result.Errors });
                }

                // Assign admin user to the admin role
                await _userManager.AddToRoleAsync(adminUser, "admin");

                // Seed additional users for each role
                var additionalUsers = new List<(string UserName, string Email, string Role, bool Gender, DateTime? DateOfBirth, string ImageUrl)>
        {
            ("manager", "manager@gmail.com", "manager", false, new DateTime(1985, 5, 15), "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/430878538_2206677789683723_4464660377243750146_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeE_Vr1x6BHZ_S__ovdDg7zS5W9udhABzaHlb252EAHNoS38q_urtNeTErRYpa0zqYNo-vOAf49-zjjLBslYOw-p&_nc_ohc=-pR_sm46Xo0Q7kNvgENuKqW&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AyOScuqnRIdDJw0yqlJ1OJE&oh=00_AYBRYtKe7HUGoF1imuyPohv5Wi3mnCKz-GF0YsTBc9lMzw&oe=674E895B"),
            ("staff", "staff@gmail.com", "staff", true, new DateTime(1995, 3, 10), "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/430878538_2206677789683723_4464660377243750146_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeE_Vr1x6BHZ_S__ovdDg7zS5W9udhABzaHlb252EAHNoS38q_urtNeTErRYpa0zqYNo-vOAf49-zjjLBslYOw-p&_nc_ohc=-pR_sm46Xo0Q7kNvgENuKqW&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AyOScuqnRIdDJw0yqlJ1OJE&oh=00_AYBRYtKe7HUGoF1imuyPohv5Wi3mnCKz-GF0YsTBc9lMzw&oe=674E895B"),
            ("factoryOwner", "factoryowner@gmail.com", "factoryOwner", true, new DateTime(1980, 7, 20), "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/430878538_2206677789683723_4464660377243750146_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeE_Vr1x6BHZ_S__ovdDg7zS5W9udhABzaHlb252EAHNoS38q_urtNeTErRYpa0zqYNo-vOAf49-zjjLBslYOw-p&_nc_ohc=-pR_sm46Xo0Q7kNvgENuKqW&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AyOScuqnRIdDJw0yqlJ1OJE&oh=00_AYBRYtKe7HUGoF1imuyPohv5Wi3mnCKz-GF0YsTBc9lMzw&oe=674E895B"),
            ("customer", "customer@gmail.com", "customer", false, new DateTime(2000, 1, 1), "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/430878538_2206677789683723_4464660377243750146_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeE_Vr1x6BHZ_S__ovdDg7zS5W9udhABzaHlb252EAHNoS38q_urtNeTErRYpa0zqYNo-vOAf49-zjjLBslYOw-p&_nc_ohc=-pR_sm46Xo0Q7kNvgENuKqW&_nc_zt=24&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=AyOScuqnRIdDJw0yqlJ1OJE&oh=00_AYBRYtKe7HUGoF1imuyPohv5Wi3mnCKz-GF0YsTBc9lMzw&oe=674E895B")
        };

                foreach (var (userName, email, role, gender, dateOfBirth, imageUrl) in additionalUsers)
                {
                    var user = new User
                    {
                        UserName = userName,
                        Email = email,
                        EmailConfirmed = true,
                        Gender = gender,
                        DateOfBirth = dateOfBirth?.ToUniversalTime(),
                        ImageUrl = imageUrl
                    };

                    result = await _userManager.CreateAsync(user, "123456");
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, role);
                    }
                    else
                    {
                        return BadRequest(new { message = $"Failed to create user {userName}", errors = result.Errors });
                    }
                }

                return Ok(new { message = "Seeding completed successfully!", rolesSeeded = roleNames });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during seeding.", error = ex.Message });
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(string email, string password, bool gender, DateTime? dateOfBirth, string? imageUrl)
        {
            var user = new User
            {
                UserName = email,
                Email = email,
                Gender = gender,
                DateOfBirth = dateOfBirth?.ToUniversalTime(),
                ImageUrl = imageUrl ?? ""
            };

            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User registered successfully!");
        }
    }
}
