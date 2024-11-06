using Services.Interfaces;
using System.Diagnostics;

namespace GoodsDesignAPI.Middlewares
{
    public class PerformanceTimeMiddleware : IMiddleware
    {
        private readonly Stopwatch _stopwatch;
        private readonly ILoggerService _loggerService;

        public PerformanceTimeMiddleware(Stopwatch stopwatch, ILoggerService loggerService)
        {
            _stopwatch = stopwatch;
            _loggerService = loggerService;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            _stopwatch.Restart();
            Console.ForegroundColor = ConsoleColor.Cyan;
            _loggerService.Info("=== Start Performance Record ===");

            Console.ResetColor();

            await next(context);

            _stopwatch.Stop();
            TimeSpan timeTaken = _stopwatch.Elapsed;

            Console.ForegroundColor = ConsoleColor.Cyan;
            _loggerService.Info("=== End Performance Record ===");
            _loggerService.Info($"Time Taken: {timeTaken:mm\\:ss\\.fff} \n");
            Console.ResetColor();
        }
    }
}
