using Services.Interfaces;

namespace GoodsDesignAPI.Middlewares
{
    public class UserStatusMiddleware : IMiddleware
    {
        private readonly ILoggerService _loggerService;
        private readonly IConfiguration configuration;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserStatusMiddleware(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILoggerService loggerService)
        {
            this.configuration = configuration;
            this.httpContextAccessor = httpContextAccessor;
            _loggerService = loggerService;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            // Lấy thông tin người dùng từ HttpContext
            var user = httpContextAccessor.HttpContext?.User;

            if (user?.Identity?.IsAuthenticated == true)
            {
                // Ghi log người dùng đã xác thực truy cập vào endpoint
                _loggerService.Info($"UserStatusMiddleware - User {user.Identity.Name} is accessing {context.Request.Path}");
            }
            else
            {
                // Ghi log người dùng chưa xác thực
                _loggerService.Info("UserStatusMiddleware - An unauthenticated user tried to access a protected resource.");
            }

            // Tiếp tục pipeline
            await next(context);
        }

    }
}
