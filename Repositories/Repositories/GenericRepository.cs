using BusinessObjects;
using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using System.Linq.Expressions;

namespace Repositories.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        private readonly DbSet<TEntity> _dbSet;
        private readonly GoodsDesignDbContext _dbContext;
        private readonly ICurrentTime _timeService;
        private readonly IClaimsService _claimsService;

        public GenericRepository(GoodsDesignDbContext context, ICurrentTime timeService, IClaimsService claimsService)
        {
            _dbSet = context.Set<TEntity>();
            _dbContext = context;
            _timeService = timeService;
            _claimsService = claimsService;
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            try
            {
                entity.CreatedAt = _timeService.GetCurrentTime();
                //var user = await _dbContext.Users.FindAsync(_claimsService.GetCurrentUserId);
                //if (user == null) throw new Exception("This user is no longer existed");
                entity.CreatedBy = _claimsService.GetCurrentUserId;
                var result = await _dbSet.AddAsync(entity);
                //await _dbContext.SaveChangesAsync();
                return result.Entity;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // riêng hàm này đã sửa để adapt theo Unit Of Work
        public async Task AddRangeAsync(List<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                entity.CreatedAt = _timeService.GetCurrentTime();
                entity.CreatedBy = _claimsService.GetCurrentUserId;
            }
            await _dbSet.AddRangeAsync(entities);
        }

        public Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate = null, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = _dbSet;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return query.ToListAsync();
        }

        public async Task<TEntity?> GetByIdAsync(Guid id, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            var result = await query.FirstOrDefaultAsync(x => x.Id == id);
            return result;
        }

        public async Task<bool> SoftRemove(TEntity entity)
        {
            entity.IsDeleted = true;
            entity.DeletedAt = _timeService.GetCurrentTime();
            entity.DeletedBy = _claimsService.GetCurrentUserId;
            entity.UpdatedAt = _timeService.GetCurrentTime();

            _dbSet.Update(entity);
            // await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftRemoveRange(List<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                entity.IsDeleted = true;
                entity.DeletedAt = _timeService.GetCurrentTime();
                entity.DeletedBy = _claimsService.GetCurrentUserId;
            }
            _dbSet.UpdateRange(entities);
            //  await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftRemoveRangeById(List<Guid> entitiesId) // update hàng loạt cùng 1 trường thì làm y chang
        {
            var entities = await _dbSet.Where(e => entitiesId.Contains(e.Id)).ToListAsync();

            foreach (var entity in entities)
            {
                entity.IsDeleted = true;
                entity.DeletedAt = _timeService.GetCurrentTime();
                entity.DeletedBy = _claimsService.GetCurrentUserId;
            }

            _dbContext.UpdateRange(entities);
            return true;
        }

        public async Task<bool> Update(TEntity entity)
        {
            entity.UpdatedAt = _timeService.GetCurrentTime();
            entity.UpdatedBy = _claimsService.GetCurrentUserId;
            _dbSet.Update(entity);
            //   await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateRange(List<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                entity.UpdatedAt = _timeService.GetCurrentTime();
                entity.UpdatedBy = _claimsService.GetCurrentUserId;
            }
            _dbSet.UpdateRange(entities);
            //  await _dbContext.SaveChangesAsync();
            return true;
        }

        public IQueryable<TEntity> GetQueryable()
        {
            return _dbSet;
        }

        //private readonly StudentEventForumDbContext _dbContext;
        //private readonly DbSet<TEntity> _dbSet;

        //public GenericRepository(StudentEventForumDbContext dbContext)
        //{
        //    _dbContext = dbContext;
        //    _dbSet = dbContext.Set<TEntity>();
        //}

        //public IQueryable<TEntity> GetAll()
        //    => _dbSet;

        //public IQueryable<TEntity> FindByCondition(Expression<Func<TEntity, bool>> predicate)
        //    => _dbSet.Where(predicate);

        //public TEntity? FirstOrDefault(Expression<Func<TEntity, bool>> predicate) => _dbSet.FirstOrDefault(predicate);

        //public async Task<TEntity?> GetByIdAsync(TKey id)
        //    => await _dbSet.FindAsync(id);
        //public async Task<TEntity?> GetByIdCompositeKeyAsync(TKey id1, TKey id2)
        //    => await _dbSet.FindAsync(id1, id2);
        //public async Task<TEntity> AddAsync(TEntity entity)
        //{
        //    var entityEntry = await _dbContext.Set<TEntity>().AddAsync(entity);
        //    return entityEntry.Entity;
        //}

        //public TEntity Update(TEntity entity)
        //{
        //    var entityEntry = _dbContext.Set<TEntity>().Update(entity);
        //    return entityEntry.Entity;
        //}

        //public TEntity Remove(TKey id)
        //{
        //    var entity = GetByIdAsync(id).Result;
        //    var entityEntry = _dbContext.Set<TEntity>().Remove(entity!);
        //    return entityEntry.Entity;
        //}
        //public TEntity RemoveCompositeKey(TKey id1, TKey id2)
        //{
        //    var entity = GetByIdCompositeKeyAsync(id1, id2).Result;
        //    var entityEntry = _dbContext.Set<TEntity>().Remove(entity!);
        //    return entityEntry.Entity;
        //}

        //public Task<int> Commit() => _dbContext.SaveChangesAsync();

        //public async Task<int> CountAsync()
        //{
        //    var count = await _dbSet.CountAsync();
        //    return count;
        //}

        //public async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        //{
        //    var count = await _dbSet.CountAsync(predicate);
        //    return count;
        //}

        //public async Task<IEnumerable<TEntity>> GetTopNItems<TKeyProperty>(Expression<Func<TEntity, TKeyProperty>> keySelector, int n)
        //{
        //    var items = await _dbSet.OrderBy(keySelector).Take(n).ToListAsync();
        //    return items;
        //}

        //public async Task AddRangeAsync(IEnumerable<TEntity> entities)
        //{
        //    await _dbContext.Set<TEntity>().AddRangeAsync(entities);
        //    await _dbContext.SaveChangesAsync();
        //}
    }
}