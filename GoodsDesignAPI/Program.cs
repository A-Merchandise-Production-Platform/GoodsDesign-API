using BusinessObjects.Entities;
using GoodsDesignAPI.Architecture;
using GoodsDesignAPI.Middlewares;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using Services.Hubs;
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
           //.AddRouteComponents("api/me", GetPersonalEdmModel());

    });

// Setup IOC Container
builder.Services.SetupIOCContainer();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

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

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".gltf"] = "model/gltf+json"; // MIME type for GLTF
provider.Mappings[".glb"] = "model/gltf-binary"; // MIME type for GLB

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider("/srv/goodsdesign"),
    RequestPath = "/files/goodsdesign",
    ContentTypeProvider = provider
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

app.MapHub<NotificationHub>("/notificationHub");

app.Run();

static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EnableLowerCamelCase();

    // Configure entity sets
    var users = builder.EntitySet<User>("Users");
    var roles = builder.EntitySet<Role>("Roles");

    var categories = builder.EntitySet<Category>("Categories");
    builder.EntitySet<Notification>("Notifications");
    var products = builder.EntitySet<Product>("Products");
    var factories = builder.EntitySet<Factory>("Factories");
    var blankvariances = builder.EntitySet<BlankVariance>("BlankVariances");
    var notifications = builder.EntitySet<Notification>("Notifications");
    var customerOrders = builder.EntitySet<CustomerOrder>("customer-orders");
    var customerOrderDetails = builder.EntitySet<CustomerOrderDetail>("customer-order-details");
    var payments = builder.EntitySet<Payment>("payments");

    // Define relationships
    users.EntityType.HasOptional(u => u.Role); // User has one Role
    roles.EntityType.HasMany(r => r.Users);
    roles.EntityType.HasMany(r => r.Users); 
    products.EntityType.HasMany(r => r.FactoryProducts); 
    categories.EntityType.HasMany(r => r.Products); 

    factories.EntityType.HasMany(r => r.FactoryProducts); 

    categories.EntityType.HasMany(r => r.Products); 

    customerOrders.EntityType.HasMany(r => r.CustomerOrderDetails);
    customerOrders.EntityType.HasMany(r => r.Payments);

    blankvariances.EntityType.HasOptional(r => r.Product);

    return builder.GetEdmModel();
}

static IEdmModel GetPersonalEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EnableLowerCamelCase();

    // Entity sets cho route /api/me/
    var personalCustomerOrders = builder.EntitySet<CustomerOrder>("me/customer-orders");
    var personalFactories = builder.EntitySet<Factory>("me/factories");
    var personalCartItems = builder.EntitySet<CartItem>("me/cart-items");
    var personalPayments = builder.EntitySet<Payment>("me/payments");

    return builder.GetEdmModel();
}