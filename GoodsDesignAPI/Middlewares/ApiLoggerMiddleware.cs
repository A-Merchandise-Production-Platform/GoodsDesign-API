using Services.Interfaces;
using System.Text;
using System.Text.Json;

namespace GoodsDesignAPI.Middlewares
{
    public class ApiLoggerMiddleware : IMiddleware
    {
        private readonly ILoggerService _loggerService;

        public ApiLoggerMiddleware(ILoggerService loggerService)
        {
            _loggerService = loggerService;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            var request = context.Request;
            var originalResponseBody = context.Response.Body;

            try
            {
                // Log request information
                var apiCall = new ApiCallModel
                {
                    Method = request.Method,
                    Path = request.Path,
                    QueryString = request.QueryString.ToString(),
                    RequestBody = await GetRequestBody(request),
                    Timestamp = DateTime.Now
                };

                _loggerService.Info($"API Call Request:\n{JsonSerializer.Serialize(apiCall, new JsonSerializerOptions { WriteIndented = true })}");

                using var responseBody = new MemoryStream();
                context.Response.Body = responseBody;

                await next(context); // Call the next middleware

                // Log response information after the response has been processed
                apiCall.ResponseBody = await GetResponseBody(responseBody);

                // Skip logging for Swagger requests
                if (!apiCall.Path.Contains("swagger"))
                {
                    _loggerService.Info($"API Call Response:\n{JsonSerializer.Serialize(apiCall, new JsonSerializerOptions { WriteIndented = true })}");
                }
            }
            catch (Exception e)
            {
                _loggerService.Error($"API Call Error Message: {e.Message}");
                _loggerService.Error($"API Call Error StackTrace: {e.StackTrace}");
                throw;
            }
            finally
            {
                context.Response.Body = originalResponseBody; // Restore the original response body
            }
        }

        private async Task<string> GetResponseBody(MemoryStream responseBody)
        {
            responseBody.Seek(0, SeekOrigin.Begin);
            var text = await new StreamReader(responseBody).ReadToEndAsync();
            responseBody.Seek(0, SeekOrigin.Begin);
            return text;
        }

        private static async Task<string> GetRequestBody(HttpRequest request)
        {
            if (request.Method != HttpMethods.Post && request.Method != HttpMethods.Put) return string.Empty;

            request.EnableBuffering(); // Enable buffering to allow reading the request body multiple times
            using var reader = new StreamReader(request.Body, Encoding.UTF8, detectEncodingFromByteOrderMarks: false, bufferSize: 1024, leaveOpen: true);
            var requestBody = await reader.ReadToEndAsync();
            request.Body.Seek(0, SeekOrigin.Begin); // Reset the stream position

            return requestBody;
        }

        private class ApiCallModel
        {
            public string Method { get; init; } = null!;
            public string Path { get; init; } = null!;
            public string QueryString { get; init; } = null!;
            public string RequestBody { get; init; } = null!;
            public string ResponseBody { get; set; } = null!;
            public DateTime Timestamp { get; set; }
        }
    }
}
