using GoodsDesignAPI.Middlewares;
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
            services.SetupMiddleware();
            services.SetupCORS();

            Console.WriteLine("=== Done setup IOC Container ===");
            return services;
        }

        private static IServiceCollection SetupDBContext(this IServiceCollection services)
        {
            //services.AddDbContext<GoodsDesignContext>(options =>
            //{
            //    options.UseSqlServer(configuration["ConnectionStrings:DefaultConnectionString"]);
            //});

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
