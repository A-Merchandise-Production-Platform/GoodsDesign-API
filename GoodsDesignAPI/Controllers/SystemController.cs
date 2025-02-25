using BusinessObjects;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.NotificationDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using Services.Interfaces;
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
        private readonly INotificationService _notificationService;
        private readonly IClaimsService _claimsService;

        public SystemController(UserManager<User> userManager, RoleManager<Role> roleManager, ILoggerService loggerService, INotificationService notificationService, IClaimsService claimsService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = loggerService;
            _notificationService = notificationService;
            _claimsService = claimsService;
        }

        [HttpPost("noti-all")]
        public async Task<IActionResult> NotifyAll()
        {
            NotificationDTO notification = new NotificationDTO
            {
                Title = "Test Notification",
                Content = "This is a test notification.",
                Url = "https://example.com",

            };

            await _notificationService.PushNotificationToAll(notification);

            return Ok(ApiResult<object>.Success(null, "Notification sent to all users."));
        }

        [HttpPost("noti-user")]
        public async Task<IActionResult> NotifyUser()
        {
            var userId = _claimsService.GetCurrentUserId;

            NotificationDTO notification = new NotificationDTO
            {
                Title = "Test Notification",
                Content = "This is a test notification.",
                Url = "https://example.com",
            };

            await _notificationService.PushNotificationToUser(userId, notification);

            return Ok(ApiResult<object>.Success(null, "Notification sent to user."));
        }

        [HttpPost("noti-role")]
        public async Task<IActionResult> NotifyRole()
        {
            NotificationDTO notification = new NotificationDTO
            {
                Title = "Test Notification",
                Content = "This is a test notification.",
                Url = "https://example.com",
            };

            await _notificationService.PushNotificationToRole(Roles.ADMIN, notification);

            return Ok(ApiResult<object>.Success(null, "Notification sent to role."));
        }

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
                var factoriesResult = await SeedFactories(context);
                var categoriesResult = await SeedCategories(context);
                var productsResult = await SeedProducts(context);
                var productVariances = await SeedBlankVariances(context);
                var factoryProductsResult = await SeedFactoryProducts(context);
                // Seed Customer Orders
                var customerOrdersResult = await SeedCustomerOrders(context);
                // Seed Payments
                var paymentsResult = await SeedPayments(context);


                await transaction.CommitAsync();

                return Ok(ApiResult<object>.Success(new
                {
                    Message = "All data seeded successfully.",
                    Details = new
                    {
                        Users = usersResult.Data,
                        Categories = categoriesResult.Data,
                        Products = productsResult.Data,
                        Factories = factoriesResult.Data,
                        FactoryProducts = factoryProductsResult.Data,
                        ProductVariances = productVariances.Data,
                        CustomerOrders = customerOrdersResult.Data,
                        Payments = paymentsResult.Data,
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

            await context.Payments.ExecuteDeleteAsync();
            await context.CustomerOrderDetails.ExecuteDeleteAsync();
            await context.CustomerOrders.ExecuteDeleteAsync();
            await context.FactoryProducts.ExecuteDeleteAsync();
            await context.Factories.ExecuteDeleteAsync();
            await context.BlankVariances.ExecuteDeleteAsync();
            await context.Products.ExecuteDeleteAsync();
            await context.Categories.ExecuteDeleteAsync();
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
        [ApiExplorerSettings(IgnoreApi = true)]
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
            new User
            {
                UserName = "admin",
                Email = "admin@gmail.com",
                RoleId = roleDict["admin"].Id,
                Address = new AddressModel
                {
                    ProvinceID = 1,
                    DistrictID = 10,
                    WardCode = "W01",
                    Street = "123 Admin Street"
                }
            },
            new User
            {
                UserName = "manager",
                Email = "manager@gmail.com",
                RoleId = roleDict["manager"].Id,
                Address = new AddressModel
                {
                    ProvinceID = 2,
                    DistrictID = 20,
                    WardCode = "W02",
                    Street = "456 Manager Ave"
                }
            },
            new User
            {
                UserName = "staff",
                Email = "staff@gmail.com",
                RoleId = roleDict["staff"].Id,
                Address = new AddressModel
                {
                    ProvinceID = 3,
                    DistrictID = 30,
                    WardCode = "W03",
                    Street = "789 Staff Road"
                }
            },
            new User
            {
                UserName = "factoryOwner",
                Email = "factoryowner@gmail.com",
                RoleId = roleDict["factoryOwner"].Id,
                Address = new AddressModel
                {
                    ProvinceID = 4,
                    DistrictID = 40,
                    WardCode = "W04",
                    Street = "101 Factory Blvd"
                }
            },
            new User
            {
                UserName = "customer",
                Email = "customer@gmail.com",
                RoleId = roleDict["customer"].Id,
                Address = new AddressModel
                {
                    ProvinceID = 5,
                    DistrictID = 50,
                    WardCode = "W05",
                    Street = "202 Customer Lane"
                }
            }
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
        [ApiExplorerSettings(IgnoreApi = true)]
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
        [ApiExplorerSettings(IgnoreApi = true)]
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
        [ApiExplorerSettings(IgnoreApi = true)]
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
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("seed-factory-products")]
        public async Task<ApiResult<List<FactoryProduct>>> SeedFactoryProducts([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                var factories = await context.Factories.ToListAsync();
                var blankVariances = await context.BlankVariances.ToListAsync();

                if (!factories.Any() || !blankVariances.Any())
                {
                    throw new Exception("Please seed factories and products before seeding factory products.");
                }

                var factoryProductsToSeed = new List<FactoryProduct>
                {
                    new FactoryProduct { FactoryId = factories[0].Id, BlankVarianceId = blankVariances[0].Id, ProductionCapacity = 500 , EstimatedProductionTimwe=0},
                    new FactoryProduct { FactoryId = factories[1].Id, BlankVarianceId = blankVariances[1].Id, ProductionCapacity = 300 , EstimatedProductionTimwe= 0}
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
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("seed-blank-variances")]
        public async Task<ApiResult<List<BlankVariance>>> SeedBlankVariances([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding Blank Variances initiated.");
                var products = await context.Products.ToListAsync();
                if (!products.Any()) throw new Exception("Please seed products before seeding blank variances.");

                var blankVariancesToSeed = new List<BlankVariance>
                {
                    new BlankVariance { Id = Guid.NewGuid(), ProductId = products[0].Id, Information = "{\"color\":\"white\",\"material\":\"cotton\"}", BlankPrice = Convert.ToString(20.00m) },
                    new BlankVariance { Id = Guid.NewGuid(), ProductId = products[0].Id, Information = "{\"color\":\"black\",\"material\":\"cotton\"}", BlankPrice = Convert.ToString(21.00m) },
                                new BlankVariance { Id = Guid.NewGuid(), ProductId = products[1].Id, Information = "{\"material\":\"plastic\",\"color\":\"red\"}", BlankPrice = "8.99" }

                };

                await context.BlankVariances.AddRangeAsync(blankVariancesToSeed);
                await context.SaveChangesAsync();

                return ApiResult<List<BlankVariance>>.Success(blankVariancesToSeed, "Blank Variances seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding Blank Variances: {ex.Message}");
                return ApiResult<List<BlankVariance>>.Error($"Error during seeding Blank Variances: {ex.Message}");
            }
        }


        [Authorize(Roles = "admin")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("seed-customer-orders")]
        public async Task<ApiResult<List<CustomerOrder>>> SeedCustomerOrders([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding Customer Orders initiated.");

                // Lấy user admin
                var adminUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == "admin");
                if (adminUser == null)
                {
                    throw new Exception("Please seed users before seeding customer orders.");
                }

                // Define Customer Orders to seed
                var customerOrdersToSeed = new List<CustomerOrder>
        {
            new CustomerOrder
            {
                Id = Guid.NewGuid(),
                CustomerId = adminUser.Id,
                Status = "Pending",
                TotalPrice = 1000,
                ShippingPrice = 50,
                DepositPaid = 300,
                OrderDate = DateTime.UtcNow.AddHours(7),
                CustomerOrderDetails = new List<CustomerOrderDetail> // Example order details
                {
                    new CustomerOrderDetail { Id = Guid.NewGuid(), UnitPrice = 500, Quantity = 1, Status = "Pending"},
                    new CustomerOrderDetail { Id = Guid.NewGuid(), UnitPrice = 500, Quantity = 1, Status = "Pending" }
                }
            },
            new CustomerOrder
            {
                Id = Guid.NewGuid(),
                CustomerId = adminUser.Id,
                Status = "In Production",
                TotalPrice = 2000,
                ShippingPrice = 100,
                DepositPaid = 600,
                OrderDate = DateTime.UtcNow.AddHours(7),
                CustomerOrderDetails = new List<CustomerOrderDetail>
                {
                    new CustomerOrderDetail { Id = Guid.NewGuid(), UnitPrice = 1000, Quantity = 2, Status = "In Progress" }
                }
            }
        };

                await context.CustomerOrders.AddRangeAsync(customerOrdersToSeed);
                await context.SaveChangesAsync();

                _logger.Success("Customer Orders seeded successfully.");
                return ApiResult<List<CustomerOrder>>.Success(customerOrdersToSeed, "Customer Orders seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding Customer Orders: {ex.Message}");
                return ApiResult<List<CustomerOrder>>.Error($"Error during seeding Customer Orders: {ex.Message}");
            }
        }

        [Authorize(Roles = "admin")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("seed-payments")]
        public async Task<ApiResult<List<Payment>>> SeedPayments([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding Payments initiated.");

                // Lấy tất cả Customer Orders đã seed
                var customerOrders = await context.CustomerOrders.ToListAsync();
                if (!customerOrders.Any())
                {
                    throw new Exception("Please seed customer orders before seeding payments.");
                }

                var paymentsToSeed = new List<Payment>();

                foreach (var order in customerOrders)
                {
                    // Tạo 2 khoản thanh toán cho mỗi order
                    var depositPayment = new Payment
                    {
                        Id = Guid.NewGuid(),
                        CustomerOrderId = order.Id,
                        CustomerId = order.CustomerId,
                        Amount = Math.Ceiling(order.TotalPrice * 0.3m), // 30% làm tròn lên
                        Type = "Deposit",
                        PaymentLog = "Payment FirstTime",
                        Status = "Completed",
                        CreatedDate = DateTime.UtcNow.AddHours(7)
                    };

                    var remainingPayment = new Payment
                    {
                        Id = Guid.NewGuid(),
                        CustomerOrderId = order.Id,
                        CustomerId = order.CustomerId,
                        Amount = order.TotalPrice - depositPayment.Amount,
                        Type = "Withdrawn",
                        PaymentLog = "Payment SecondTime",
                        Status = "Pending",
                        CreatedDate = DateTime.UtcNow.AddHours(7)
                    };

                    paymentsToSeed.Add(depositPayment);
                    paymentsToSeed.Add(remainingPayment);
                }

                await context.Payments.AddRangeAsync(paymentsToSeed);
                await context.SaveChangesAsync();

                _logger.Success("Payments seeded successfully.");
                return ApiResult<List<Payment>>.Success(paymentsToSeed, "Payments seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding Payments: {ex.Message}");
                return ApiResult<List<Payment>>.Error($"Error during seeding Payments: {ex.Message}");
            }
        }

        [Authorize(Roles = "admin")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("admin-test-authorize")]
        public IActionResult AdminEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Admin!"));
        }

        [Authorize(Roles = "manager")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("manager-test-authorize")]
        public IActionResult ManagerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Manager!"));
        }

        [Authorize(Roles = "staff")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("staff-test-authorize")]
        public IActionResult StaffEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Staff!"));
        }

        [Authorize(Roles = "factoryOwner")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("factory-owner-test-authorize")]
        public IActionResult FactoryOwnerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Factory Owner!"));
        }

        [Authorize(Roles = "customer")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("customer-test-authorize")]
        public IActionResult CustomerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Customer!"));
        }

        [Authorize(Roles = "admin, manager")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("admin-manager-test-authorize")]
        public IActionResult AdminManagerEndpoint()
        {
            return Ok(ApiResult<object>.Success(null, "Hello, Admin or Manager!"));
        }
    }
}
