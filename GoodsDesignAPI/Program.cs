using BusinessObjects.Entities;
using GoodsDesignAPI.Architecture;
using GoodsDesignAPI.Middlewares;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    })
    .AddOData(opt =>
    {
        opt.Select().Filter().Expand().OrderBy().SetMaxTop(100).Count()
           .AddRouteComponents("odata", GetEdmModel());
    });

// Setup IOC Container
builder.Services.SetupIOCContainer();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

try
{
    app.ApplyMigrations(app.Logger);
}
catch (Exception e)
{
    app.Logger.LogError(e, "An problem occurred during migration!");
}

app.UseRouting();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<PerformanceTimeMiddleware>();
app.UseMiddleware<UserStatusMiddleware>();
app.UseMiddleware<ApiLoggerMiddleware>();

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.InjectJavascript("/custom-swagger.js");
    c.InjectStylesheet("/custom-swagger.css");
});

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();

    // Configure entity sets
    var users = builder.EntitySet<User>("Users");
    var roles = builder.EntitySet<Role>("Roles");

    // Define navigation properties
    users.EntityType.HasMany(u => u.Roles);
    roles.EntityType.HasMany(r => r.Users);

    return builder.GetEdmModel();
}