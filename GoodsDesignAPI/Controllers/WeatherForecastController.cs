using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Services.CommonService;

namespace GoodsDesignAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILoggerService _logger;

        public WeatherForecastController()
        {
            _logger = new LoggerService();
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            _logger.Warn("Fetching weather forecast data");
            _logger.Info("Returning weather forecast data");
            _logger.Success("Weather forecast data returned successfully");
            _logger.Error("Failed to fetch weather forecast data");

            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
