using BusinessObjects;
using BusinessObjects.Entities; // Include your namespace for the custom User entity
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILoggerService _logger;

        public SystemController(UserManager<User> userManager, RoleManager<Role> roleManager, ILoggerService loggerService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = loggerService;
        }
        [Authorize(Roles = "admin")]
        [HttpPost("seed-users")]
        public async Task<IActionResult> SeedUser()
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
                        Address = "HCM",
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
        [HttpPost("seed-areas")]
        public async Task<IActionResult> SeedAreas([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                // Log seed operation
                _logger.Info("Seed areas request initiated.");

                // Remove all existing areas
                var existingAreas = context.Areas.ToList();
                if (existingAreas.Any())
                {
                    context.Areas.RemoveRange(existingAreas);
                    await context.SaveChangesAsync();
                    _logger.Info("Existing areas removed successfully.");
                }

                // Seed new areas
                var areasToSeed = new List<Area>
        {
            new Area { Id = Guid.NewGuid(), Name = "Area 1", Position = "North", Code = "A001" },
            new Area { Id = Guid.NewGuid(), Name = "Area 2", Position = "South", Code = "A002" },
            new Area { Id = Guid.NewGuid(), Name = "Area 3", Position = "East", Code = "A003" },
            new Area { Id = Guid.NewGuid(), Name = "Area 4", Position = "West", Code = "A004" },
            new Area { Id = Guid.NewGuid(), Name = "Area 5", Position = "Central", Code = "A005" }
        };

                await context.Areas.AddRangeAsync(areasToSeed);
                await context.SaveChangesAsync();
                _logger.Success("Areas seeded successfully.");

                return Ok(new { message = "Seeding areas completed successfully!", seededAreas = areasToSeed });
            }
            catch (Exception ex)
            {
                _logger.Error($"An error occurred during area seeding: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during area seeding.", error = ex.Message });
            }
        }
        [Authorize(Roles = "admin")]
        [HttpPost("seed-categories")]
        public async Task<IActionResult> SeedCategories([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                // Log seed operation
                _logger.Info("Seed categories request initiated.");

                // Remove all existing categories
                var existingCategories = context.Categories.ToList();
                if (existingCategories.Any())
                {
                    context.Categories.RemoveRange(existingCategories);
                    await context.SaveChangesAsync();
                    _logger.Info("Existing categories removed successfully.");
                }

                // Seed new categories
                var categoriesToSeed = new List<Category>
                {
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "Clothes",
                        Description = "A wide variety of clothing for men, women, and children, including casual wear, formal attire, and accessories.",
                        ImageUrl = "https://uk.tilley.com/cdn/shop/products/M01BA1001_Black_b.jpg?v=1701806262"
                    },
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "Phone cases",
                        Description = "Durable and stylish phone cases designed to protect your device while showcasing your personality.",
                        ImageUrl = "https://www.fidlock.com/consumer/media/98/12/7c/1675256834/fidlock_website_vacuum_case_iphone11pro_vorn_1500x1500px_201026-2.jpg"
                    },
                };


                await context.Categories.AddRangeAsync(categoriesToSeed);
                await context.SaveChangesAsync();
                _logger.Success("Categories seeded successfully.");

                return Ok(new { message = "Seeding categories completed successfully!", seededCategories = categoriesToSeed });
            }
            catch (Exception ex)
            {
                _logger.Error($"An error occurred during category seeding: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during category seeding.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-products")]
        public async Task<IActionResult> SeedProducts([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                // Log seed operation
                _logger.Info("Seed products request initiated.");

                // Remove all existing products
                var existingProducts = context.Products.ToList();
                if (existingProducts.Any())
                {
                    context.Products.RemoveRange(existingProducts);
                    await context.SaveChangesAsync();
                    _logger.Info("Existing products removed successfully.");
                }

                // Get existing categories for assigning to products
                var existingCategories = context.Categories.ToList();
                if (!existingCategories.Any())
                {
                    _logger.Warn("No categories found. Please seed categories before seeding products.");
                    return BadRequest(new { message = "Please seed categories before seeding products." });
                }

                // Seed new products
                var productsToSeed = new List<Product>
        {
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "T-Shirt",
                Description = "A comfortable cotton T-shirt, perfect for casual wear.",
                CategoryId = existingCategories.First().Id, // Assigning to the first category
                ImageUrl = "https://example.com/tshirt.jpg",
                Model3DUrl = "https://example.com/tshirt-3d-model",
                CreatedAt = DateTime.UtcNow.AddHours(7)
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Phone Case",
                Description = "A durable phone case that protects your device and looks great.",
                CategoryId = existingCategories.Last().Id, // Assigning to the last category
                ImageUrl = "https://example.com/phone-case.jpg",
                Model3DUrl = "https://example.com/phone-case-3d-model",
                CreatedAt = DateTime.UtcNow.AddHours(7)
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Formal Shirt",
                Description = "Elegant and stylish shirt for formal occasions.",
                CategoryId = existingCategories.First().Id, // Assigning to the first category
                ImageUrl = "https://example.com/formal-shirt.jpg",
                Model3DUrl = "https://example.com/formal-shirt-3d-model",
                CreatedAt = DateTime.UtcNow.AddHours(7)
            }
        };

                await context.Products.AddRangeAsync(productsToSeed);
                await context.SaveChangesAsync();

                _logger.Success("Products seeded successfully.");

                return Ok(new { message = "Seeding products completed successfully!", seededProducts = productsToSeed });
            }
            catch (Exception ex)
            {
                _logger.Error($"An error occurred during product seeding: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during product seeding.", error = ex.Message });
            }
        }
        [Authorize(Roles = "admin")]

        [HttpPost("seed-factories")]
        public async Task<IActionResult> SeedFactories([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                // Log seed operation
                _logger.Info("Seed factories request initiated.");

                // Remove all existing factories
                var existingFactories = context.Factories.ToList();
                if (existingFactories.Any())
                {
                    context.Factories.RemoveRange(existingFactories);
                    await context.SaveChangesAsync();
                    _logger.Info("Existing factories removed successfully.");
                }

                // Get users with FactoryOwner role
                var factoryOwnerRole = context.Roles.FirstOrDefault(r => r.Name == "factoryOwner");
                if (factoryOwnerRole == null)
                {
                    _logger.Warn("FactoryOwner role not found. Please seed roles and users before seeding factories.");
                    return BadRequest(new { message = "Please seed roles and users before seeding factories." });
                }

                var factoryOwners = context.Users
                    .Where(u => u.RoleId == factoryOwnerRole.Id)
                    .ToList();

                if (!factoryOwners.Any())
                {
                    _logger.Warn("No users with FactoryOwner role found. Please seed users with FactoryOwner role before seeding factories.");
                    return BadRequest(new { message = "Please seed users with FactoryOwner role before seeding factories." });
                }

                // Seed new factories
                var factoriesToSeed = new List<Factory>
        {
            new Factory
            {
                Id = Guid.NewGuid(),
                FactoryOwnerId = factoryOwners[0].Id, // Assigning the first FactoryOwner
                Information = "{\"size\":\"large\",\"location\":\"HCM\"}", // JSON string
                Contract = "{\"duration\":\"2 years\",\"status\":\"active\"}", // JSON string
                                                IsActive = true

            },
            new Factory
            {
                Id = Guid.NewGuid(),
                FactoryOwnerId = factoryOwners[0].Id, // Assigning the second FactoryOwner
                Information = "{\"size\":\"medium\",\"location\":\"HN\"}",
                Contract = "{\"duration\":\"3 years\",\"status\":\"active\"}",
                                IsActive = true

            },
            new Factory
            {
                Id = Guid.NewGuid(),
                FactoryOwnerId = factoryOwners[0].Id, // Assigning the third FactoryOwner
                Information = "{\"size\":\"small\",\"location\":\"Da Nang\"}",
                Contract = "{\"duration\":\"1 year\",\"status\":\"inactive\"}",
                IsActive = true
            }
        };

                await context.Factories.AddRangeAsync(factoriesToSeed);
                await context.SaveChangesAsync();
                _logger.Success("Factories seeded successfully.");

                return Ok(new { message = "Seeding factories completed successfully!", seededFactories = factoriesToSeed });
            }
            catch (Exception ex)
            {
                _logger.Error($"An error occurred during factory seeding: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during factory seeding.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-factory-products")]
        public async Task<IActionResult> SeedFactoryProducts([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                // Log seed operation
                _logger.Info("Seed factory products request initiated.");

                // Remove all existing factory products
                var existingFactoryProducts = context.FactoryProducts.ToList();
                if (existingFactoryProducts.Any())
                {
                    context.FactoryProducts.RemoveRange(existingFactoryProducts);
                    await context.SaveChangesAsync();
                    _logger.Info("Existing factory products removed successfully.");
                }

                // Get existing factories and products
                var existingFactories = context.Factories.ToList();
                var existingProducts = context.Products.ToList();

                if (!existingFactories.Any() || !existingProducts.Any())
                {
                    _logger.Warn("No factories or products found. Please seed factories and products before seeding factory products.");
                    return BadRequest(new { message = "Please seed factories and products before seeding factory products." });
                }

                // Seed new factory products
                var factoryProductsToSeed = new List<FactoryProduct>
        {
            new FactoryProduct
            {
                FactoryId = existingFactories[0].Id, // Assigning to the first factory
                ProductId = existingProducts[0].Id, // Assigning to the first product
                ProductionCapacity = 500,
                EstimatedProductionTimwe = 10
            },
            new FactoryProduct
            {
                FactoryId = existingFactories[1].Id, // Assigning to the second factory
                ProductId = existingProducts[1].Id, // Assigning to the second product
                ProductionCapacity = 300,
                EstimatedProductionTimwe = 7
            },
            new FactoryProduct
            {
                FactoryId = existingFactories[2].Id,
                ProductId = existingProducts[0].Id,
                ProductionCapacity = 200,
                EstimatedProductionTimwe = 5
            }
        };

                await context.FactoryProducts.AddRangeAsync(factoryProductsToSeed);
                await context.SaveChangesAsync();

                _logger.Success("Factory products seeded successfully.");

                return Ok(new { message = "Seeding factory products completed successfully!", seededFactoryProducts = factoryProductsToSeed });
            }
            catch (Exception ex)
            {
                _logger.Error($"An error occurred during factory product seeding: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during factory product seeding.", error = ex.Message });
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
