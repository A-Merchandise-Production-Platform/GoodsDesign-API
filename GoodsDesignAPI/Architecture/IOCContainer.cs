using AutoMapper;
using BusinessObjects;
using BusinessObjects.Entities;
using GoodsDesignAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Repositories;
using Repositories.Commons;
using Repositories.Interfaces;
using Repositories.Repositories;
using Services.Interfaces;
using Services.Mapper;
using Services.Services;
using Services.Services.CommonService;
using System.Diagnostics;
using System.Reflection;
using System.Text;

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
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            //Add business services
            services.SetupBusinessServicesLayer();

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.SetupThirdParty();

            Console.WriteLine("=== Done setup IOC Container ===");
            return services;
        }

        public static IServiceCollection SetupThirdParty(this IServiceCollection services)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true)
                .AddEnvironmentVariables()
                .Build();
            var accessKey = configuration["Minio:AccessKey"];
            var secretKey = configuration["Minio:SecretKey"];
            //services.AddMinio(accessKey, secretKey);
            return services;
        }

        public static IServiceCollection SetupBusinessServicesLayer(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAreaService, AreaService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IFactoryService, FactoryService>();
            services.AddScoped<IFactoryProductService, FactoryProductService>();
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
                .AddJsonFile("appsettings.json", true, true)
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
                .AddJsonFile("appsettings.json", true, true)
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
