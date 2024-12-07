namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {

        //IGenericRepository<Area> AreaGenericRepository { get; }
        Task<int> SaveChangeAsync();
    }
}