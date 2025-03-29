import { customerOrdersData } from './customer-orders.data';
import { productDesignsData } from './product-designs.data';

export const customerOrderDetailsData = [
  {
    id: 'detail001',
    orderId: 'order001',
    designId: productDesignsData.productDesigns[0].id,
    price: 140000,
    quantity: 2,
    status: 'PENDING',
    qualityCheckStatus: 'PENDING',
    reworkStatus: 'NOT_REQUIRED',
  },
  {
    id: 'detail002',
    orderId: 'order002',
    designId: productDesignsData.productDesigns[1].id,
    price: 285000,
    quantity: 3,
    status: 'IN_PRODUCTION',
    qualityCheckStatus: 'PARTIAL_APPROVED',
    reworkStatus: 'IN_PROGRESS',
  },
]; 