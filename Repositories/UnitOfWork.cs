using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GoodsDesignDbContext _dbContext;
      //  private readonly IGenericRepository<User> _userGenericRepository;

        public UnitOfWork(GoodsDesignDbContext dbContext
        //    ,IGenericRepository<User> userGenericRepository
            )
        {
            _dbContext = dbContext;
        //    _userGenericRepository = userGenericRepository;
        }

      
     //   public IGenericRepository<User> UserGenericRepository => _userGenericRepository;


        public Task<int> SaveChangeAsync()
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