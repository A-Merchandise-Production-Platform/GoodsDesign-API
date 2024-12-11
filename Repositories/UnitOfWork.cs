using BusinessObjects;
using BusinessObjects.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GoodsDesignDbContext _dbContext;
        //  private readonly IGenericRepository<User> _userGenericRepository;
        private readonly IGenericRepository<Area> _areaGenericRepository;
        private readonly IGenericRepository<Category> _categoryGenericRepository;
        private readonly IGenericRepository<Product> _productGenericRepository;

        public UnitOfWork(GoodsDesignDbContext dbContext
        //    ,IGenericRepository<User> userGenericRepository
            , IGenericRepository<Area> areaGenericRepository
            , IGenericRepository<Category> categoryGenericRepository
            , IGenericRepository<Product> productGenericRepository

            )
        {
            _dbContext = dbContext;
            //    _userGenericRepository = userGenericRepository;
            _areaGenericRepository = areaGenericRepository;
            _categoryGenericRepository = categoryGenericRepository;
            _productGenericRepository = productGenericRepository;
        }

        //   public IGenericRepository<User> UserGenericRepository => _userGenericRepository;
        public IGenericRepository<Area> AreaGenericRepository => _areaGenericRepository;
        public IGenericRepository<Category> CategoryGenericRepository => _categoryGenericRepository;
        public IGenericRepository<Product> ProductGenericRepository => _productGenericRepository;

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