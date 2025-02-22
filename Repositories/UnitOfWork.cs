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
        private readonly IGenericRepository<BlankVariance> _productVarianceRepository;
        private readonly IGenericRepository<ProductPositionType> _productPositionTypeRepository;
        private readonly IGenericRepository<CartItem> _cartItemGenericRepository;
        private readonly IGenericRepository<CustomerOrder> _customerOrderGenericRepository;
        private readonly IGenericRepository<Payment> _paymentGenericRepository;


        public UnitOfWork(GoodsDesignDbContext dbContext
        //    ,IGenericRepository<User> userGenericRepository
            , IGenericRepository<Category> categoryGenericRepository
            , IGenericRepository<Product> productGenericRepository
            , IGenericRepository<Notification> notificationRepository
            , IGenericRepository<Factory> factoryRepository
            , IGenericRepository<FactoryProduct> factoryProductRepository
            , IGenericRepository<BlankVariance> productVarianceRepository
            , IGenericRepository<ProductPositionType> productPositionTypeRepository
            , IGenericRepository<CartItem> cartItemGenericRepository
            , IGenericRepository<CustomerOrder> customerOrderGenericRepository
            , IGenericRepository<Payment> paymentGenericRepository




            )
        {
            _dbContext = dbContext;
            //    _userGenericRepository = userGenericRepository;
            _categoryGenericRepository = categoryGenericRepository;
            _productGenericRepository = productGenericRepository;
            _notificationRepository = notificationRepository;
            _factoryRepository = factoryRepository;
            _factoryProductRepository = factoryProductRepository;
            _productVarianceRepository = productVarianceRepository;
            _productPositionTypeRepository = productPositionTypeRepository;
            _cartItemGenericRepository = cartItemGenericRepository;
            _customerOrderGenericRepository = customerOrderGenericRepository;
            _paymentGenericRepository = paymentGenericRepository;
        }

        //   public IGenericRepository<User> UserGenericRepository => _userGenericRepository;
        public IGenericRepository<Category> CategoryGenericRepository => _categoryGenericRepository;
        public IGenericRepository<Product> ProductGenericRepository => _productGenericRepository;
        public IGenericRepository<Notification> NotificationRepository => _notificationRepository;
        public IGenericRepository<Factory> FactoryRepository => _factoryRepository;
        public IGenericRepository<FactoryProduct> FactoryProductRepository => _factoryProductRepository;
        public IGenericRepository<BlankVariance> ProductVarianceRepository => _productVarianceRepository;
        public IGenericRepository<ProductPositionType> ProductPositionTypeRepository => _productPositionTypeRepository;
        public IGenericRepository<CartItem> CartItemGenericRepository => _cartItemGenericRepository;
        public IGenericRepository<CustomerOrder> CustomerOrderGenericRepository => _customerOrderGenericRepository;
        public IGenericRepository<Payment> PaymentGenericRepository => _paymentGenericRepository;




        public Task<int> SaveChangesAsync()
        {
            try
            {
                return _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}