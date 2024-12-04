using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace GoodsDesignAPI.Architecture
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app, ILogger _logger)
        {
            try
            {
                _logger.LogInformation("Applying migrations...");
                using IServiceScope scope = app.ApplicationServices.CreateScope();

                using GoodsDesignDbContext dbContext =
                    scope.ServiceProvider.GetRequiredService<GoodsDesignDbContext>();

                dbContext.Database.Migrate();
                _logger.LogInformation("Migrations applied successfully!");
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An problem occurred during migration!");
            }
        }
    }
}
