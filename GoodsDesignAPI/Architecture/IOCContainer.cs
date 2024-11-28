using BusinessObjects;
using BusinessObjects.Entities;
using GoodsDesignAPI.Middlewares;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;
using Services.Services.CommonService;
using System.Diagnostics;

namespace GoodsDesignAPI.Architecture
{
    public static class IOCContainer
    {
        public static IServiceCollection SetupIOCContainer(this IServiceCollection services)
        {
            //Add Logger
            services.AddScoped<ILoggerService, LoggerService>();

            //Add Services
            services.SetupDBContext();
            services.SetupIdentity();
            services.SetupMiddleware();
            services.SetupCORS();

            Console.WriteLine("=== Done setup IOC Container ===");
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
            .AddDefaultTokenProviders();

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

            services.AddScoped<ApiLoggerMiddleware>();
            services.AddSingleton<GlobalExceptionMiddleware>();
            services.AddTransient<PerformanceTimeMiddleware>();
            services.AddScoped<UserStatusMiddleware>();

            return services;
        }


    }
}
