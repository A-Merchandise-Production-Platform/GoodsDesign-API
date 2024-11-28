using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SystemController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
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
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Create an admin user and assign to admin role
            var adminUser = new IdentityUser
            {
                UserName = "admin",
                Email = "admin@gmail.com",
                EmailConfirmed = true
            };

            var adminPassword = "Admin@123";
            var result = await _userManager.CreateAsync(adminUser, adminPassword);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to create admin user", errors = result.Errors });
            }

            // Assign admin user to the admin role
            await _userManager.AddToRoleAsync(adminUser, "admin");

            return Ok(new { message = "Seeding completed successfully!" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string email, string password)
        {
            var user = new IdentityUser { UserName = email, Email = email };
            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User registered successfully!");
        }
    }
}
