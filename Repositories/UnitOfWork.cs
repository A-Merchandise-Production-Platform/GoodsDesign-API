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
        private readonly IGenericRepository<Notification> _notificationRepository;

        public UnitOfWork(GoodsDesignDbContext dbContext
        //    ,IGenericRepository<User> userGenericRepository
            , IGenericRepository<Area> areaGenericRepository
            , IGenericRepository<Category> categoryGenericRepository
            , IGenericRepository<Notification> notificationRepository

            )
        {
            _dbContext = dbContext;
            //    _userGenericRepository = userGenericRepository;
            _areaGenericRepository = areaGenericRepository;
            _categoryGenericRepository = categoryGenericRepository;
            _notificationRepository = notificationRepository;
        }

        //   public IGenericRepository<User> UserGenericRepository => _userGenericRepository;
        public IGenericRepository<Area> AreaGenericRepository => _areaGenericRepository;
        public IGenericRepository<Category> CategoryGenericRepository => _categoryGenericRepository;
        public IGenericRepository<Notification> NotificationRepository => _notificationRepository;

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