using BusinessObjects;
using BusinessObjects.Entities;
using DataTransferObjects.JsonBDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Services.Interfaces.CommonService;
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

      //  [Authorize(Roles = "admin")]
        [HttpPost("seed-all-data")]
        public async Task<IActionResult> SeedAllData([FromServices] GoodsDesignDbContext context)
        {
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                _logger.Info("Seeding all data initiated.");

                // Clear all data
                await ClearDatabase(context);

                // Seed data in order
                var usersResult = await SeedUsers();
                var areasResult = await SeedAreas(context);
                var categoriesResult = await SeedCategories(context);
                var productsResult = await SeedProducts(context);
                var factoriesResult = await SeedFactories(context);
                var factoryProductsResult = await SeedFactoryProducts(context);
                var productVariances = await SeedProductVariances(context);
                var blankProductsInStockResult = await SeedBlankProductsInStock(context);


                await transaction.CommitAsync();

                return Ok(ApiResult<object>.Success(new
                {
                    Message = "All data seeded successfully.",
                    Details = new
                    {
                        Users = usersResult.Data,
                        Areas = areasResult.Data,
                        Categories = categoriesResult.Data,
                        Products = productsResult.Data,
                        Factories = factoriesResult.Data,
                        FactoryProducts = factoryProductsResult.Data,
                        ProductVariances = productVariances.Data,
                        BlankProductInStock = blankProductsInStockResult.Data,
                    }
                }));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.Error($"Error during seeding all data: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error("An error occurred during seeding all data."));
            }
        }

        private async Task ClearDatabase(GoodsDesignDbContext context)
        {
            _logger.Info("Clearing all data in the database...");


            await context.BlankProductsInStocks.ExecuteDeleteAsync();
            await context.FactoryProducts.ExecuteDeleteAsync();
            await context.Factories.ExecuteDeleteAsync();
            await context.ProductVariances.ExecuteDeleteAsync();
            await context.Products.ExecuteDeleteAsync();
            await context.Categories.ExecuteDeleteAsync();
            await context.Areas.ExecuteDeleteAsync();
            await context.Notifications.ExecuteDeleteAsync();

            var users = _userManager.Users.ToList();
            foreach (var user in users)
            {
                await _userManager.DeleteAsync(user);
            }

            var roles = _roleManager.Roles.ToList();
            foreach (var role in roles)
            {
                await _roleManager.DeleteAsync(role);
            }

            _logger.Success("All data cleared successfully.");
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-users")]
        public async Task<ApiResult<List<User>>> SeedUsers()
        {
            try
            {
                var roleNames = new[] { "admin", "manager", "staff", "factoryOwner", "customer" };
                var roleDict = new Dictionary<string, Role>();

                foreach (var roleName in roleNames)
                {
                    var role = new Role { Name = roleName };
                    var result = await _roleManager.CreateAsync(role);
                    if (!result.Succeeded)
                    {
                        throw new Exception($"Failed to create role: {roleName}");
                    }
                    roleDict.Add(roleName, role);
                }

                var usersToSeed = new List<User>
                {
                    new User { UserName = "admin", Email = "admin@gmail.com", RoleId = roleDict["admin"].Id },
                    new User { UserName = "manager", Email = "manager@gmail.com", RoleId = roleDict["manager"].Id },
                    new User { UserName = "staff", Email = "staff@gmail.com", RoleId = roleDict["staff"].Id },
                    new User { UserName = "factoryOwner", Email = "factoryowner@gmail.com", RoleId = roleDict["factoryOwner"].Id },
                    new User { UserName = "customer", Email = "customer@gmail.com", RoleId = roleDict["customer"].Id }
                };

                usersToSeed.ForEach(x => x.IsActive = true);

                foreach (var user in usersToSeed)
                {
                    var result = await _userManager.CreateAsync(user, "123456");
                    if (!result.Succeeded)
                    {
                        throw new Exception($"Failed to create user: {user.UserName}");
                    }
                }

                return ApiResult<List<User>>.Success(usersToSeed, "Users seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error seeding users: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-areas")]
        public async Task<ApiResult<List<Area>>> SeedAreas([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                var areasToSeed = new List<Area>
                {
                    new Area { Id = Guid.NewGuid(), Name = "Area 1", Position = "North", Code = "A001" },
                    new Area { Id = Guid.NewGuid(), Name = "Area 2", Position = "South", Code = "A002" },
                    new Area { Id = Guid.NewGuid(), Name = "Area 3", Position = "East", Code = "A003" }
                };

                await context.Areas.AddRangeAsync(areasToSeed);
                await context.SaveChangesAsync();

                return ApiResult<List<Area>>.Success(areasToSeed, "Areas seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error seeding areas: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-categories")]
        public async Task<ApiResult<List<Category>>> SeedCategories([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                var categoriesToSeed = new List<Category>
                {
                    new Category { Id = Guid.NewGuid(), Name = "Clothes", Description = "Wide variety of clothing." ,ImageUrl="" },
                    new Category { Id = Guid.NewGuid(), Name = "Phone Cases", Description = "Durable and stylish." ,ImageUrl= ""}
                };

                await context.Categories.AddRangeAsync(categoriesToSeed);
                await context.SaveChangesAsync();

                return ApiResult<List<Category>>.Success(categoriesToSeed, "Categories seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error seeding categories: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-products")]
        public async Task<ApiResult<List<Product>>> SeedProducts([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                var existingCategories = await context.Categories.ToListAsync();
                if (!existingCategories.Any())
                {
                    throw new Exception("Please seed categories before seeding products.");
                }
                var productsToSeed = new List<Product>
                {
                    new Product
                    {
                        Id = Guid.NewGuid(),
                        Name = "T-Shirt",
                        Description = "Cotton T-Shirt.",
                        CategoryId = existingCategories.First().Id,
                        ImageUrl = "https://example.com/tshirt.jpg",
                        Model3DUrl = "https://example.com/tshirt-3d-model"
                    },
                    new Product
                    {
                        Id = Guid.NewGuid(),
                        Name = "Phone Case",
                        Description = "Durable Phone Case.",
                        CategoryId = existingCategories.Last().Id,
                        ImageUrl = "https://example.com/phone-case.jpg",
                        Model3DUrl = "https://example.com/phone-case-3d-model"
                    }
                };

                await context.Products.AddRangeAsync(productsToSeed);
                await context.SaveChangesAsync();

                return ApiResult<List<Product>>.Success(productsToSeed, "Products seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error seeding products: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-factories")]
        public async Task<ApiResult<List<Factory>>> SeedFactories([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                var factoryOwnerRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "factoryOwner");
                if (factoryOwnerRole == null)
                {
                    throw new Exception("Please seed roles and users before seeding factories.");
                }

                var factoryOwners = await context.Users.Where(u => u.RoleId == factoryOwnerRole.Id).ToListAsync();
                if (!factoryOwners.Any())
                {
                    throw new Exception("Please seed factory owners before seeding factories.");
                }

                var factoriesToSeed = new List<Factory>
                {
                    new Factory { Id = Guid.NewGuid(), FactoryOwnerId = factoryOwners[0].Id, Information = "{\"size\":\"large\"}" ,Contract= "{\"info\":\"large\"}"},
                    new Factory { Id = Guid.NewGuid(), FactoryOwnerId = factoryOwners[0].Id, Information = "{\"size\":\"medium\"}" , Contract= "{\"info\":\"large\"}"}
                };

                await context.Factories.AddRangeAsync(factoriesToSeed);
                await context.SaveChangesAsync();

                return ApiResult<List<Factory>>.Success(factoriesToSeed, "Factories seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error seeding factories: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-factory-products")]
        public async Task<ApiResult<List<FactoryProduct>>> SeedFactoryProducts([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                var factories = await context.Factories.ToListAsync();
                var products = await context.Products.ToListAsync();

                if (!factories.Any() || !products.Any())
                {
                    throw new Exception("Please seed factories and products before seeding factory products.");
                }

                var factoryProductsToSeed = new List<FactoryProduct>
                {
                    new FactoryProduct { FactoryId = factories[0].Id, ProductId = products[0].Id, ProductionCapacity = 500 , EstimatedProductionTimwe=0},
                    new FactoryProduct { FactoryId = factories[1].Id, ProductId = products[1].Id, ProductionCapacity = 300 , EstimatedProductionTimwe= 0}
                };

                await context.FactoryProducts.AddRangeAsync(factoryProductsToSeed);
                await context.SaveChangesAsync();

                return ApiResult<List<FactoryProduct>>.Success(factoryProductsToSeed, "Factory products seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error seeding factory products: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("seed-product-variances")]
        public async Task<ApiResult<List<ProductVariance>>> SeedProductVariances([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding Product Variances initiated.");

                // Get existing products to assign variances
                var existingProducts = await context.Products.ToListAsync();
                if (!existingProducts.Any())
                {
                    throw new Exception("Please seed products before seeding product variances.");
                }

                // Define Product Variances to seed
                var productVariancesToSeed = new List<ProductVariance>
        {
            new ProductVariance
            {
                Id = Guid.NewGuid(),
                ProductId = existingProducts[0].Id,
                Information = "{\"color\":\"white\",\"size\":\"L\"}", // JSON string for additional information
                BlankPrice = "19.99"
            },
            new ProductVariance
            {
                Id = Guid.NewGuid(),
                ProductId = existingProducts[0].Id,
                Information = "{\"color\":\"black\",\"size\":\"M\"}",
                BlankPrice = "18.99"
            },
            new ProductVariance
            {
                Id = Guid.NewGuid(),
                ProductId = existingProducts[1].Id,
                Information = "{\"material\":\"silicone\",\"color\":\"blue\"}",
                BlankPrice = "9.99"
            },
            new ProductVariance
            {
                Id = Guid.NewGuid(),
                ProductId = existingProducts[1].Id,
                Information = "{\"material\":\"plastic\",\"color\":\"red\"}",
                BlankPrice = "8.99"
            }
        };

                // Add Product Variances to database
                await context.ProductVariances.AddRangeAsync(productVariancesToSeed);
                await context.SaveChangesAsync();

                _logger.Success("Product Variances seeded successfully.");
                return ApiResult<List<ProductVariance>>.Success(productVariancesToSeed, "Product Variances seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding Product Variances: {ex.Message}");
                return ApiResult<List<ProductVariance>>.Error($"Error during seeding Product Variances: {ex.Message}");
            }
        }

    //    [Authorize(Roles = "admin")]
        [HttpPost("seed-blank-products-in-stock")]
        public async Task<ApiResult<List<BlankProductInStock>>> SeedBlankProductsInStock([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding Blank Products In Stock initiated.");

                // Get existing ProductVariances and Areas
                var productVariances = await context.ProductVariances.ToListAsync();
                var areas = await context.Areas.ToListAsync();

                if (!productVariances.Any())
                {
                    throw new Exception("Please seed ProductVariances before seeding Blank Products In Stock.");
                }

                if (!areas.Any())
                {
                    throw new Exception("Please seed Areas before seeding Blank Products In Stock.");
                }

                // Define Blank Products In Stock to seed
                var blankProductsInStockToSeed = new List<BlankProductInStock>
        {
            new BlankProductInStock
            {
                Id = Guid.NewGuid(),
                ProductVarianceId = productVariances[0].Id,
                AreaId = areas[0].Id,
                QuantityInStock = 100
            },
            new BlankProductInStock
            {
                Id = Guid.NewGuid(),
                ProductVarianceId = productVariances[1].Id,
                AreaId = areas[1].Id,
                QuantityInStock = 150
            },
            new BlankProductInStock
            {
                Id = Guid.NewGuid(),
                ProductVarianceId = productVariances[2].Id,
                AreaId = areas[2].Id,
                QuantityInStock = 200
            },
            new BlankProductInStock
            {
                Id = Guid.NewGuid(),
                ProductVarianceId = productVariances[0].Id,
                AreaId = areas[2].Id,
                QuantityInStock = 50
            }
        };

                // Add Blank Products In Stock to database
                await context.BlankProductsInStocks.AddRangeAsync(blankProductsInStockToSeed);
                await context.SaveChangesAsync();

                _logger.Success("Blank Products In Stock seeded successfully.");
                return ApiResult<List<BlankProductInStock>>.Success(blankProductsInStockToSeed, "Blank Products In Stock seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding Blank Products In Stock: {ex.Message}");
                return ApiResult<List<BlankProductInStock>>.Error($"Error during seeding Blank Products In Stock: {ex.Message}");
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
