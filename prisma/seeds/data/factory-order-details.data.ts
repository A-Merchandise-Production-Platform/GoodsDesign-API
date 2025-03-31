import { OrderStatus, QualityCheckStatus } from '@prisma/client';

export const factoryOrderDetailsData = {
  factoryOrderDetails: [
    {
      id: 'factoryorderdetail001',
      designId: 'design001',
      factoryOrderId: 'factoryorder001',
      orderDetailId: 'detail001',
      quantity: 100,
      price: 150000,
      status: OrderStatus.IN_PRODUCTION,
      completedQty: 0,
      rejectedQty: 0,
      productionCost: 100000,
      qualityStatus: QualityCheckStatus.PENDING,
      qualityCheckedAt: null,
      qualityCheckedBy: null
    },
    {
      id: 'factoryorderdetail002',
      designId: 'design002',
      factoryOrderId: 'factoryorder002',
      orderDetailId: 'detail002',
      quantity: 50,
      price: 200000,
      status: OrderStatus.IN_PRODUCTION,
      completedQty: 0,
      rejectedQty: 0,
      productionCost: 150000,
      qualityStatus: QualityCheckStatus.PARTIAL_APPROVED,
      qualityCheckedAt: new Date(),
      qualityCheckedBy: 'staff001'
    },
    {
      id: 'factoryorderdetail003',
      designId: 'design003',
      factoryOrderId: 'factoryorder003',
      orderDetailId: 'detail001',
      quantity: 75,
      price: 175000,
      status: OrderStatus.IN_PRODUCTION,
      completedQty: 0,
      rejectedQty: 0,
      productionCost: 125000,
      qualityStatus: QualityCheckStatus.REJECTED,
      qualityCheckedAt: new Date(),
      qualityCheckedBy: 'staff002'
    },
  ],
}; 