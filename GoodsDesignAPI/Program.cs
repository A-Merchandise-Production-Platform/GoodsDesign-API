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
           .AddRouteComponents("api", GetEdmModel());
    });

// Setup IOC Container
builder.Services.SetupIOCContainer();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
app.UseRouting();

try
{
    app.ApplyMigrations(app.Logger);
}
catch (Exception e)
{
    app.Logger.LogError(e, "An problem occurred during migration!");
}

app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider("/srv/goodsdesign"),
    RequestPath = "/files/goodsdesign"
});


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


app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<PerformanceTimeMiddleware>();
app.UseMiddleware<UserStatusMiddleware>();
app.UseMiddleware<ApiLoggerMiddleware>();

app.Run();

static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EnableLowerCamelCase();

    // Configure entity sets
    var users = builder.EntitySet<User>("Users");
    var roles = builder.EntitySet<Role>("Roles");
   
    builder.EntitySet<Area>("Areas");
    var categories = builder.EntitySet<Category>("Categories");
    builder.EntitySet<Notification>("Notifications");
    var products = builder.EntitySet<Product>("Products");
    var factories = builder.EntitySet<Factory>("Factories");

    // Define relationships
    users.EntityType.HasOptional(u => u.Role); // User has one Role
    roles.EntityType.HasMany(r => r.Users); // Role has many Users
    roles.EntityType.HasMany(r => r.Users); // Role has many Users
    products.EntityType.HasMany(r => r.FactoryProducts); // Role has many Users
    factories.EntityType.HasMany(r => r.FactoryProducts); // Role has many Users
    categories.EntityType.HasMany(r => r.Products); // Role has many Users

    return builder.GetEdmModel();
}