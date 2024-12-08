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

        public UnitOfWork(GoodsDesignDbContext dbContext
        //    ,IGenericRepository<User> userGenericRepository
            , IGenericRepository<Area> areaGenericRepository
            )
        {
            _dbContext = dbContext;
            //    _userGenericRepository = userGenericRepository;
            _areaGenericRepository = areaGenericRepository;
        }

        //   public IGenericRepository<User> UserGenericRepository => _userGenericRepository;
        public IGenericRepository<Area> AreaGenericRepository => _areaGenericRepository;

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