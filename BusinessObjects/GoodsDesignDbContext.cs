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
        public DbSet<BlankProductInStock> BlankProductsInStock { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Factory> Factories { get; set; }
        public DbSet<FactoryProduct> FactoryProducts { get; set; }

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
                .WithMany()
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlankProductInStock>()
                .HasOne(bp => bp.ProductVariance)
                .WithMany()
                .HasForeignKey(bp => bp.ProductVarianceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlankProductInStock>()
                .HasOne(bp => bp.Area)
                .WithMany()
                .HasForeignKey(bp => bp.PlaceId)
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




        }
    }
}
