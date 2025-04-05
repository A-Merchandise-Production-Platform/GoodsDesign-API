import { OrderDetailStatus, QualityCheckStatus } from '@prisma/client';

export const customerOrderDetailsData = [
  {
    id: 'detail001',
    orderId: 'order001',
    designId: 'design001',
    price: 140000,
    quantity: 2,
    status: OrderDetailStatus.COMPLETED,
    qualityCheckStatus: QualityCheckStatus.APPROVED,
  },
  {
    id: 'detail002',
    orderId: 'order002',
    designId: 'design002',
    price: 285000,
    quantity: 3,
    status: OrderDetailStatus.IN_PRODUCTION,
  },
  {
    id: 'detail003',
    orderId: 'order003',
    designId: 'design003',
    price: 190000,
    quantity: 1,
    status: OrderDetailStatus.PENDING,
    qualityCheckStatus: QualityCheckStatus.PENDING,
  },
]; 