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


            return services;
        }

        private static void SetupDBContext(this IServiceCollection services)
        {
            //services.AddDbContext<GoodsDesignContext>(options =>
            //{
            //    options.UseSqlServer(configuration["ConnectionStrings:DefaultConnectionString"]);
            //});
        }

        private static void SetupMiddleware(this IServiceCollection services)
        {
            //Setup For UserStatusMiddleware
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //Setup For PerformanceTimeMiddleware
            services.AddTransient(_ => new Stopwatch());

            services.AddScoped<ApiLoggerMiddleware>();
            services.AddSingleton<GlobalExceptionMiddleware>();
            services.AddTransient<PerformanceTimeMiddleware>();
            services.AddScoped<UserStatusMiddleware>();
        }


    }
}
