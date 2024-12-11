using BusinessObjects.Entities;

namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Area> AreaGenericRepository { get; }
        IGenericRepository<Category> CategoryGenericRepository { get; }
        IGenericRepository<Product> ProductGenericRepository { get; }

        IGenericRepository<Notification> NotificationRepository { get; }
        Task<int> SaveChangesAsync();
    }
}