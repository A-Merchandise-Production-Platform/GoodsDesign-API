namespace GoodsDesignAPI.Middlewares
{
    public class UserStatusMiddleware : IMiddleware
    {
        private readonly ILogger<UserStatusMiddleware> logger;
        private readonly IConfiguration configuration;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserStatusMiddleware(ILogger<UserStatusMiddleware> logger, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            this.logger = logger;
            this.configuration = configuration;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            // Lấy thông tin người dùng từ HttpContext
            var user = httpContextAccessor.HttpContext?.User;

            if (user?.Identity?.IsAuthenticated == true)
            {
                // Ghi log người dùng đã xác thực truy cập vào endpoint
                logger.LogInformation($"User {user.Identity.Name} is accessing {context.Request.Path}");
            }
            else
            {
                // Ghi log người dùng chưa xác thực
                logger.LogWarning("An unauthenticated user tried to access a protected resource.");
            }

            // Tiếp tục pipeline
            await next(context);
        }

    }
}
