using AutoMapper;
using BusinessObjects;
using BusinessObjects.Entities;
using GoodsDesignAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Net.payOS;
using Repositories;
using Repositories.Commons;
using Repositories.Interfaces;
using Repositories.Repositories;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Mapper;
using Services.Services;
using Services.Services.CommonService;
using Services.Services.ThirdPartyService.PaymentGateway;
using Services.Services.ThirdPartyService.PaymentGateway.Interfaces;
using Services.Services.ThirdPartyService.PaymentGateway.Services;
using System.Diagnostics;
using System.Reflection;
using System.Text;
using VNPAY.NET;

namespace GoodsDesignAPI.Architecture
{
    public static class IOCContainer
    {
        public static IServiceCollection SetupIOCContainer(this IServiceCollection services)
        {
            //Add Logger
            services.AddScoped<ILoggerService, LoggerService>();
            //Add Infrastructure
            services.AddAutoMapper(typeof(MapperConfigProfile).Assembly);
            //Add Project Services
            services.SetupDBContext();
            services.SetupIdentity();
            services.SetupSwagger();
            services.SetupMiddleware();
            services.SetupCORS();
            services.SetupJWT();
            //Add generic repositories
            services.AddScoped<IDesignPositionRepository, DesignPositionRepository>();
            services.AddScoped<IDesignPositionService, DesignPositionService>();

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            //Add business services
            services.SetupBusinessServicesLayer();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.SetupThirdParty();

            services.AddSignalR();
            services.AddHttpClient();

            Console.WriteLine("=== Done setup IOC Container ===");
            return services;
        }

        public static IServiceCollection SetupThirdParty(this IServiceCollection services)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, false)
                .AddEnvironmentVariables()
                .Build();
            var accessKey = configuration["Minio:AccessKey"];
            var secretKey = configuration["Minio:SecretKey"];
            //services.AddMinio(accessKey, secretKey);

            //PayOS
            services.AddSingleton<PayOS>(provider =>
            {
                string clientId = configuration["Payment:PayOS:ClientId"] ?? throw new Exception("Cannot find PAYOS_CLIENT_ID");
                string apiKey = configuration["Payment:PayOS:ApiKey"] ?? throw new Exception("Cannot find PAYOS_API_KEY");
                string checksumKey = configuration["Payment:PayOS:ChecksumKey"] ?? throw new Exception("Cannot find PAYOS_CHECKSUM_KEY");

                return new PayOS(clientId, apiKey, checksumKey);
            });
            //VnPay
            services.AddSingleton<IVnpay>(p =>
            {
                string _tmnCode = configuration["Payment:VnPay:TmnCode"];
                string _hashSecret = configuration["Payment:VnPay:HashSecret"];
                string _baseUrl = configuration["Payment:VnPay:PaymentUrl"];
                string _callbackUrl = configuration["Payment:VnPay:ReturnUrl"];
                return new Vnpay();
            });

            return services;
        }

        public static IServiceCollection SetupBusinessServicesLayer(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IFactoryService, FactoryService>();
            services.AddScoped<IFactoryProductService, FactoryProductService>();
            services.AddScoped<IProductVarianceService, ProductVarianceService>();
            services.AddScoped<ICartItemService, CartItemService>();
            services.AddScoped<ICustomerOrderService, CustomerOrderService>();
            services.AddScoped<IPaymentService, PaymentService>();

            services.AddScoped<IVnPayService, VnPayService>();
            services.AddScoped<IPayOSService, PayOSService>();
            return services;
        }


        private static IServiceCollection SetupSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                // Loại bỏ MetadataController của OData khỏi tài liệu Swagger
                c.DocInclusionPredicate((docName, apiDesc) =>
                {
                    // Loại bỏ tất cả các API từ Microsoft.AspNetCore.OData.Routing.Controllers
                    return !apiDesc.ActionDescriptor.DisplayName.Contains("MetadataController");
                });

                // Thêm quy ước tùy chỉnh cho schemaId
                c.CustomSchemaIds(type => type.FullName);

                // Xử lý các enum kiểu inline để tránh lỗi
                c.UseInlineDefinitionsForEnums();

                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "GoodsDesignAPI", Version = "v1" });
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    Name = "JWT Authentication",
                    Description = "Enter your JWT token in this field",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                };

                c.AddSecurityDefinition("Bearer", jwtSecurityScheme);

                var securityRequirement = new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}
                        }
                    };

                c.AddSecurityRequirement(securityRequirement);

                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

                // Cấu hình Swagger để sử dụng Newtonsoft.Json
                c.UseAllOfForInheritance();

            });


            return services;
        }

        private static IServiceCollection SetupDBContext(this IServiceCollection services)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, false)
                .AddEnvironmentVariables()
                .Build();

            services.AddDbContext<GoodsDesignDbContext>(options =>
            {
                options.UseNpgsql(configuration["ConnectionStrings:DefaultConnection"]);
            });

            return services;
        }

        private static IServiceCollection SetupIdentity(this IServiceCollection services)
        {
            services.AddIdentity<User, Role>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;

                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<GoodsDesignDbContext>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<DataProtectorTokenProvider<User>>("REFRESHTOKENPROVIDER");

            return services;
        }

        private static IServiceCollection SetupCORS(this IServiceCollection services)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
                });
            });

            return services;
        }

        private static IServiceCollection SetupMiddleware(this IServiceCollection services)
        {
            //Setup For UserStatusMiddleware
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //Setup For PerformanceTimeMiddleware
            services.AddSingleton<Stopwatch>();
            services.AddScoped<ICurrentTime, CurrentTime>();
            services.AddScoped<IClaimsService, ClaimsService>();

            services.AddScoped<ApiLoggerMiddleware>();
            services.AddSingleton<GlobalExceptionMiddleware>();
            services.AddTransient<PerformanceTimeMiddleware>();
            services.AddScoped<UserStatusMiddleware>();

            return services;
        }

        private static IServiceCollection SetupJWT(this IServiceCollection services)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, false)
                .AddEnvironmentVariables()
                .Build();

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidIssuer = configuration["JWT:Issuer"],
                        ValidAudience = configuration["JWT:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]))
                    };
                });
            services.AddAuthorization();

            return services;
        }


    }
}
