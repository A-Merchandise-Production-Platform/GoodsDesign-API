import { OrderDetailStatus, QualityCheckStatus, ReworkStatus } from '@prisma/client';
import { customerOrdersData } from './customer-orders.data';
import { productDesignsData } from './product-designs.data';

export const customerOrderDetailsData = [
  {
    id: 'detail001',
    orderId: 'order001',
    designId: 'design001',
    price: 140000,
    quantity: 2,
    status: OrderDetailStatus.COMPLETED,
    qualityCheckStatus: QualityCheckStatus.APPROVED,
    reworkStatus: ReworkStatus.NOT_REQUIRED,
  },
  {
    id: 'detail002',
    orderId: 'order002',
    designId: 'design002',
    price: 285000,
    quantity: 3,
    status: OrderDetailStatus.IN_PRODUCTION,
    qualityCheckStatus: QualityCheckStatus.PARTIAL_APPROVED,
    reworkStatus: ReworkStatus.IN_PROGRESS,
  },
  {
    id: 'detail003',
    orderId: 'order003',
    designId: 'design003',
    price: 190000,
    quantity: 1,
    status: OrderDetailStatus.PENDING,
    qualityCheckStatus: QualityCheckStatus.PENDING,
    reworkStatus: ReworkStatus.NOT_REQUIRED,
  },
]; 