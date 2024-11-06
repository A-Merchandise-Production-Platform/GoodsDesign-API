namespace GoodsDesignAPI.Architecture
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app, ILogger _logger)
        {
            try
            {
                //using IServiceScope scope = app.ApplicationServices.CreateScope();

                //using DbContext dbContext =
                //    scope.ServiceProvider.GetRequiredService<DbContext>();

                //dbContext.Database.Migrate();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An problem occurred during migration!");
            }
        }
    }
}
