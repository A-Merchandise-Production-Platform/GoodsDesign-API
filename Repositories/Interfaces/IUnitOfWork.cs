using BusinessObjects.Entities;


namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        
    //   IGenericRepository<User> UserGenericRepository { get; }

        Task<int> SaveChangeAsync();
    }
}