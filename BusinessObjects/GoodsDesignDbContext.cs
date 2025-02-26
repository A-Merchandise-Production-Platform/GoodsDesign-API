using BusinessObjects.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BusinessObjects
{
    public class GoodsDesignDbContext : IdentityDbContext<User, Role, Guid>
    {
        public GoodsDesignDbContext(DbContextOptions<GoodsDesignDbContext> options)
            : base(options)
        {
        }

        //Add table
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductPositionType> ProductPositionTypes { get; set; }
        public DbSet<BlankVariance> BlankVariances { get; set; }
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
        public DbSet<Cache> Caches { get; set; }
        public DbSet<CustomerOrderDetail> CustomerOrderDetails { get; set; }
        public DbSet<FactoryOrder> FactoryOrders { get; set; }
        public DbSet<FactoryOrderDetail> FactoryOrderDetails { get; set; }
        public DbSet<DesignPosition> DesignPositions { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Đổi tên bảng Identity Framework
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

            // One-to-Many: User → Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Product → Category
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: ProductPositionType → Product
            modelBuilder.Entity<ProductPositionType>()
                .HasOne(ppt => ppt.Product)
                .WithMany(p => p.ProductPositionTypes)
                .HasForeignKey(ppt => ppt.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: BlankVariance → Product
            modelBuilder.Entity<BlankVariance>()
                .HasOne(pv => pv.Product)
                .WithMany(p => p.BlankVariances)
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-Many: FactoryProduct (Composite Key)
            modelBuilder.Entity<FactoryProduct>()
                .HasKey(fp => new { fp.FactoryId, fp.BlankVarianceId });

            // Many-to-Many: DesignPosition (Composite Key)
            modelBuilder.Entity<DesignPosition>()
                .HasKey(dp => new { dp.ProductDesignId, dp.ProductPositionTypeId });

            // One-to-Many: ProductDesign → User & BlankVariance
            modelBuilder.Entity<ProductDesign>()
                .HasOne(pd => pd.User)
                .WithMany(u => u.ProductDesigns)
                .HasForeignKey(pd => pd.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductDesign>()
                .HasOne(pd => pd.BlankVariance)
                .WithMany(bv => bv.ProductDesigns)
                .HasForeignKey(pd => pd.BlankVarianceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình JSONB cho PostgreSQL
            modelBuilder.Entity<BlankVariance>()
                .Property(pv => pv.Information)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Factory>()
                .Property(f => f.Information)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Factory>()
                .Property(f => f.Contract)
                .HasColumnType("jsonb");

            modelBuilder.Entity<DesignPosition>()
                .Property(dp => dp.DesignJSON)
                .HasColumnType("jsonb");

            modelBuilder.Entity<SystemConfig>()
                .Property(sc => sc.Value)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Cache>()
                .Property(c => c.Value)
                .HasColumnType("jsonb");

            modelBuilder.Entity<User>()
                .Property(u => u.Address)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<AddressModel>(v, (JsonSerializerOptions)null))
                .HasColumnType("jsonb");
        }




    }


}
