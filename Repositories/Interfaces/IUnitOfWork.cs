using BusinessObjects.Entities;

namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Area> AreaGenericRepository { get; }
        Task<int> SaveChangesAsync();
    }
}