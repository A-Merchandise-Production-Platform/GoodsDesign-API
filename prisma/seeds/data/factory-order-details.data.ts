import { OrderDetailStatus, QualityCheckStatus } from '@prisma/client';

export const factoryOrderDetailsData = {
  factoryOrderDetails: [
    {
      id: 'factoryorderdetail001',
      designId: 'design001',
      factoryOrderId: 'factoryorder001',
      orderDetailId: 'detail001',
      quantity: 2,
      price: 140000,
      status: OrderDetailStatus.COMPLETED,
      completedQty: 2,
      rejectedQty: 0,
      productionCost: 100000,
      qualityStatus: QualityCheckStatus.APPROVED,
      qualityCheckedAt: new Date('2023-03-14T15:30:00.000Z'),
      qualityCheckedBy: 'staff001'
    },
    {
      id: 'factoryorderdetail002',
      designId: 'design002',
      factoryOrderId: 'factoryorder002',
      orderDetailId: 'detail002',
      quantity: 3,
      price: 285000,
      status: OrderDetailStatus.IN_PRODUCTION,
      completedQty: 1,
      rejectedQty: 1,
      productionCost: 150000,
      qualityStatus: QualityCheckStatus.REJECTED,
      qualityCheckedAt: new Date('2023-03-10T14:20:00.000Z'),
      qualityCheckedBy: 'staff001'
    },
    {
      id: 'factoryorderdetail003',
      designId: 'design003',
      factoryOrderId: 'factoryorder003',
      orderDetailId: 'detail003',
      quantity: 1,
      price: 190000,
      status: OrderDetailStatus.PENDING,
      completedQty: 0,
      rejectedQty: 0,
      productionCost: 50000,
      qualityStatus: QualityCheckStatus.PENDING,
      qualityCheckedAt: null,
      qualityCheckedBy: null
    },
  ],
}; 