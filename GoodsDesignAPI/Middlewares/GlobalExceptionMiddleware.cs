using System.Net;
using System.Text.Json;

namespace GoodsDesignAPI.Middlewares
{
    public class GlobalExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                // TODO: Push notification & log the exception
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("GlobalExceptionMiddleware - An error occurred:");
                Console.WriteLine(ex.Message);
                Console.ResetColor();

                var response = new
                {
                    data = (object)null,
                    success = false,
                    message = ex.Message + " - " + ex.InnerException?.Message
                };

                var jsonResponse = JsonSerializer.Serialize(response);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsync(jsonResponse);
            }
        }
    }
}
