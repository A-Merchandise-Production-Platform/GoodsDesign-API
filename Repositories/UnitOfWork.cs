using BusinessObjects;
using BusinessObjects.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GoodsDesignDbContext _dbContext;
        //  private readonly IGenericRepository<User> _userGenericRepository;
        private readonly IGenericRepository<Category> _categoryGenericRepository;
        private readonly IGenericRepository<Product> _productGenericRepository;
        private readonly IGenericRepository<Notification> _notificationRepository;
        private readonly IGenericRepository<Factory> _factoryRepository;
        private readonly IGenericRepository<FactoryProduct> _factoryProductRepository;
        private readonly IGenericRepository<BlankVariance> _blankVarianceRepository;
        private readonly IGenericRepository<ProductPositionType> _productPositionTypeRepository;
        private readonly IGenericRepository<CartItem> _cartItemGenericRepository;
        private readonly IGenericRepository<CustomerOrder> _customerOrderGenericRepository;
        private readonly IGenericRepository<Payment> _paymentGenericRepository;
        private readonly IGenericRepository<ProductDesign> _productDesignGenericRepository;
        private readonly IDesignPositionRepository _designPositionRepository;



        public UnitOfWork(GoodsDesignDbContext dbContext
        //    ,IGenericRepository<User> userGenericRepository
            , IGenericRepository<Category> categoryGenericRepository
            , IGenericRepository<Product> productGenericRepository
            , IGenericRepository<Notification> notificationRepository
            , IGenericRepository<Factory> factoryRepository
            , IGenericRepository<FactoryProduct> factoryProductRepository
            , IGenericRepository<BlankVariance> blankVarianceRepository
            , IGenericRepository<ProductPositionType> productPositionTypeRepository
            , IGenericRepository<CartItem> cartItemGenericRepository
            , IGenericRepository<CustomerOrder> customerOrderGenericRepository
            , IGenericRepository<Payment> paymentGenericRepository
            , IGenericRepository<ProductDesign> productDesignGenericRepository
            , IDesignPositionRepository designPositionRepository

            )
        {
            _dbContext = dbContext;
            //    _userGenericRepository = userGenericRepository;
            _categoryGenericRepository = categoryGenericRepository;
            _productGenericRepository = productGenericRepository;
            _notificationRepository = notificationRepository;
            _factoryRepository = factoryRepository;
            _factoryProductRepository = factoryProductRepository;
            _blankVarianceRepository = blankVarianceRepository;
            _productPositionTypeRepository = productPositionTypeRepository;
            _cartItemGenericRepository = cartItemGenericRepository;
            _customerOrderGenericRepository = customerOrderGenericRepository;
            _paymentGenericRepository = paymentGenericRepository;
            _productDesignGenericRepository = productDesignGenericRepository;
            _designPositionRepository = designPositionRepository;
        }

        //   public IGenericRepository<User> UserGenericRepository => _userGenericRepository;
        public IGenericRepository<Category> CategoryGenericRepository => _categoryGenericRepository;
        public IGenericRepository<Product> ProductGenericRepository => _productGenericRepository;
        public IGenericRepository<Notification> NotificationRepository => _notificationRepository;
        public IGenericRepository<Factory> FactoryRepository => _factoryRepository;
        public IGenericRepository<FactoryProduct> FactoryProductRepository => _factoryProductRepository;
        public IGenericRepository<BlankVariance> BlankVarianceRepository => _blankVarianceRepository;
        public IGenericRepository<ProductPositionType> ProductPositionTypeRepository => _productPositionTypeRepository;
        public IGenericRepository<CartItem> CartItemGenericRepository => _cartItemGenericRepository;
        public IGenericRepository<CustomerOrder> CustomerOrderGenericRepository => _customerOrderGenericRepository;
        public IGenericRepository<Payment> PaymentGenericRepository => _paymentGenericRepository;
        public IGenericRepository<ProductDesign> ProductDesignGenericRepository => _productDesignGenericRepository;

        public IDesignPositionRepository DesignPositionRepository => _designPositionRepository;




        public async Task<int> SaveChangesAsync()
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var result = await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
                return result;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}