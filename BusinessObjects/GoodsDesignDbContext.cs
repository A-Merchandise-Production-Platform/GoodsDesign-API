using BusinessObjects.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects
{
    public class GoodsDesignDbContext : IdentityDbContext<User, Role, Guid>
    {
        public GoodsDesignDbContext(DbContextOptions<GoodsDesignDbContext> options)
            : base(options)
        {
        }

        //Add table
        public DbSet<Area> Areas { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductPositionType> ProductPositionTypes { get; set; }
        public DbSet<ProductVariance> ProductVariances { get; set; }
        public DbSet<BlankProductInStock> BlankProductsInStocks { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Factory> Factories { get; set; }
        public DbSet<FactoryProduct> FactoryProducts { get; set; }
        public DbSet<CustomerOrder> CustomerOrders { get; set; }
        public DbSet<ProductDesign> ProductDesigns { get; set; }
        public DbSet<DesignComponentPosition> DesignComponentPositions { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<SystemConfig> SystemConfigs { get; set; }
        public DbSet<CustomerOrderDetail> CustomerOrderDetails { get; set; }
        public DbSet<FactoryOrder> FactoryOrders { get; set; }
        public DbSet<FactoryOrderDetail> FactoryOrderDetails { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map Identity tables to custom table names
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

            // One-to-Many relationship between User and Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role) // A User has one Role
                .WithMany(r => r.Users) // A Role has many Users
                .HasForeignKey(u => u.RoleId) // Foreign Key in User
                .OnDelete(DeleteBehavior.Cascade); // Optional: Cascade delete users when a role is deleted


            // Configure relationships for custom tables
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductPositionType>()
                .HasOne(ppt => ppt.Product)
                .WithMany()
                .HasForeignKey(ppt => ppt.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductVariance>()
     .HasOne(pv => pv.Product)
     .WithMany(p => p.ProductVariances)
     .HasForeignKey(pv => pv.ProductId)
     .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BlankProductInStock>()
                .HasOne(bp => bp.ProductVariance)
                .WithMany()
                .HasForeignKey(bp => bp.ProductVarianceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlankProductInStock>()
                .HasOne(bp => bp.Area)
                .WithMany()
                .HasForeignKey(bp => bp.AreaId)
                .OnDelete(DeleteBehavior.Restrict);

            // Optional: Configure jsonb column (if needed)
            modelBuilder.Entity<ProductVariance>()
                .Property(pv => pv.Information)
                .HasColumnType("jsonb");

            // Configure Many-to-Many relationship using FactoryProduct
            modelBuilder.Entity<FactoryProduct>()
                .HasKey(fp => new { fp.FactoryId, fp.ProductId }); // Composite primary key

            modelBuilder.Entity<FactoryProduct>()
                .HasOne(fp => fp.Factory)
                .WithMany(f => f.FactoryProducts) // Factory -> FactoryProducts
                .HasForeignKey(fp => fp.FactoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FactoryProduct>()
                .HasOne(fp => fp.Product)
                .WithMany(p => p.FactoryProducts) // Product -> FactoryProducts
                .HasForeignKey(fp => fp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Factory>()
                .Property(f => f.Information)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Factory>()
                .Property(f => f.Contract)
                .HasColumnType("jsonb");


            // Configure SystemConfig
            modelBuilder.Entity<SystemConfig>()
                .HasKey(sc => sc.Id); // Primary Key

            modelBuilder.Entity<SystemConfig>()
                .Property(sc => sc.Bank)
                .HasColumnType("jsonb"); // JSONB for PostgreSQL

            modelBuilder.Entity<SystemConfig>()
                .Property(sc => sc.Color)
                .HasColumnType("jsonb");

        }
    }
}
