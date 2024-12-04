using BusinessObjects.Entities; // Include your namespace for the custom User entity
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public SystemController(UserManager<User> userManager, RoleManager<Role> roleManager)
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
                var roleDict = new Dictionary<string, Role>();

                foreach (var roleName in roleNames)
                {
                    if (!await _roleManager.RoleExistsAsync(roleName))
                    {
                        var role = new Role { Name = roleName };
                        var result = await _roleManager.CreateAsync(role);
                        if (result.Succeeded)
                        {
                            roleDict.Add(roleName, role);
                        }
                        else
                        {
                            return BadRequest(new { message = $"Failed to create role {roleName}", errors = result.Errors });
                        }
                    }
                }

                // Seed users for each role
                var usersToSeed = new List<(string UserName, string Email, string RoleName, bool Gender, DateTime? DateOfBirth, string ImageUrl)>
        {
            ("admin", "admin@gmail.com", "admin", true, new DateTime(1990, 1, 1), "https://example.com/admin.jpg"),
            ("manager", "manager@gmail.com", "manager", false, new DateTime(1985, 5, 15), "https://example.com/manager.jpg"),
            ("staff", "staff@gmail.com", "staff", true, new DateTime(1995, 3, 10), "https://example.com/staff.jpg"),
            ("factoryOwner", "factoryowner@gmail.com", "factoryOwner", true, new DateTime(1980, 7, 20), "https://example.com/factoryowner.jpg"),
            ("customer", "customer@gmail.com", "customer", false, new DateTime(2000, 1, 1), "https://example.com/customer.jpg")
        };

                foreach (var (userName, email, roleName, gender, dateOfBirth, imageUrl) in usersToSeed)
                {
                    var user = new User
                    {
                        UserName = userName,
                        Email = email,
                        EmailConfirmed = true,
                        Gender = gender,
                        DateOfBirth = dateOfBirth?.ToUniversalTime(),
                        ImageUrl = imageUrl,
                        RoleId = roleDict[roleName].Id,
                        IsActive = true,
                        Role = roleDict[roleName]
                        
                    };

                    var result = await _userManager.CreateAsync(user, "123456");
                    if (!result.Succeeded)
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

        [Authorize(Roles = "admin")]
        [HttpGet("admin-test-authorize")]
        public IActionResult AdminEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Admin!"));
        }

        [Authorize(Roles = "manager")]
        [HttpGet("manager-test-authorize")]
        public IActionResult ManagerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Manager!"));
        }

        [Authorize(Roles = "staff")]
        [HttpGet("staff-test-authorize")]
        public IActionResult StaffEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Staff!"));
        }

        [Authorize(Roles = "factoryOwner")]
        [HttpGet("factory-owner-test-authorize")]
        public IActionResult FactoryOwnerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Factory Owner!"));
        }

        [Authorize(Roles = "customer")]
        [HttpGet("customer-test-authorize")]
        public IActionResult CustomerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Customer!"));
        }

        [Authorize(Roles = "admin, manager")]
        [HttpGet("admin-manager-test-authorize")]
        public IActionResult AdminManagerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Admin or Manager!"));
        }
    }
}
