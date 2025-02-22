﻿
using BusinessObjects.Entities;

namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Category> CategoryGenericRepository { get; }
        IGenericRepository<Product> ProductGenericRepository { get; }

        IGenericRepository<Notification> NotificationRepository { get; }
        IGenericRepository<Factory> FactoryRepository { get; }
        IGenericRepository<FactoryProduct> FactoryProductRepository { get; }
        IGenericRepository<BlankVariance> ProductVarianceRepository { get; }
        IGenericRepository<ProductPositionType> ProductPositionTypeRepository { get; }
        IGenericRepository<CartItem> CartItemGenericRepository { get; }
        IGenericRepository<CustomerOrder> CustomerOrderGenericRepository { get; }
        IGenericRepository<Payment> PaymentGenericRepository { get; }

        Task<int> SaveChangesAsync();
    }
}