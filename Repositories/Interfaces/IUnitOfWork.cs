﻿using BusinessObjects.Entities;

namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Area> AreaGenericRepository { get; }
        IGenericRepository<Category> CategoryGenericRepository { get; }
        IGenericRepository<Product> ProductGenericRepository { get; }

        IGenericRepository<Notification> NotificationRepository { get; }
        IGenericRepository<Factory> FactoryRepository { get; }
        IGenericRepository<FactoryProduct> FactoryProductRepository { get; }
        IGenericRepository<ProductVariance> ProductVarianceRepository { get; }
        IGenericRepository<BlankProductInStock> BlankProductInStockRepository { get; }
        IGenericRepository<ProductPositionType> ProductPositionTypeRepository { get; }

        Task<int> SaveChangesAsync();
    }
}