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
            try
            {
                var request = context.Request;

                // Log API call information
                var apiCall = new ApiCallModel
                {
                    Method = request.Method,
                    Path = request.Path,
                    QueryString = request.QueryString.ToString(),
                    RequestBody = await GetRequestBody(request),
                };

                _loggerService.Info($"API Call Request: {request.Method} - {request.Path} \n{JsonSerializer.Serialize(apiCall, new JsonSerializerOptions { WriteIndented = true })}");

                // Get the response body after invoking the next middleware
                await next(context);

                apiCall.ResponseBody = await GetResponseBody(context);

                // Skip logging for Swagger requests
                if (!apiCall.Path.Contains("swagger"))
                {
                    _loggerService.Info($"API Call Response: {request.Method} - {request.Path} \n{JsonSerializer.Serialize(apiCall, new JsonSerializerOptions { WriteIndented = true })}");
                }
            }
            catch (Exception e)
            {
                _loggerService.Error($"API Call Error Message: {e.Message}");
                _loggerService.Error($"API Call Error StackTrace: {e.StackTrace}");
                throw;
            }
        }

        private async Task<string> GetResponseBody(HttpContext context)
        {
            // Intercept the response body
            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await Task.CompletedTask;

            // Retrieve the response body as a string
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            var responseBodyString = await new StreamReader(context.Response.Body).ReadToEndAsync();
            context.Response.Body.Seek(0, SeekOrigin.Begin);

            // Restore the original response body stream
            await responseBody.CopyToAsync(originalBodyStream);

            return responseBodyString;
        }

        private static async Task<string> GetRequestBody(HttpRequest request)
        {
            if (request.Method != HttpMethods.Post && request.Method != HttpMethods.Put) return string.Empty;

            request.EnableBuffering(); // Allow the request body to be read multiple times

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
        }
    }
}
