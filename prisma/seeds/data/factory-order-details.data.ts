import { factoryOrdersData } from './factory-orders.data';
import { productDesignsData } from './product-designs.data';
import { customerOrderDetailsData } from './customer-order-details.data';
import { OrderStatus } from '@prisma/client';

export const factoryOrderDetailsData = [
  {
    id: 'factoryorderdetail001',
    designId: productDesignsData.productDesigns[0].id,
    factoryOrderId: factoryOrdersData[0].id,
    orderDetailId: 'detail001',
    quantity: 2,
    status: OrderStatus.PENDING,
    productionCost: 100,
  },
  {
    id: 'factoryorderdetail002',
    designId: productDesignsData.productDesigns[1].id,
    factoryOrderId: factoryOrdersData[1].id,
    orderDetailId: 'detail002',
    quantity: 3,
    status: OrderStatus.IN_PRODUCTION,
    productionCost: 150,
  },
]; 