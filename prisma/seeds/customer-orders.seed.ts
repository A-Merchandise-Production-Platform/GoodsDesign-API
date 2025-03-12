import { PrismaClient, OrderStatus, QualityCheckStatus, ReworkStatus } from '@prisma/client';
import { customerOrdersData } from './data/customer-orders.data';

export async function seedCustomerOrders(prisma: PrismaClient) {
  try {
    console.log('Seeding customer orders...');

    for (const orderData of customerOrdersData.customerOrders) {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: orderData.userEmail }
      });

      if (!user) {
        throw new Error(`User with email ${orderData.userEmail} not found`);
      }

      // Create order
      const order = await prisma.customerOrder.upsert({
        where: { id: orderData.id },
        update: {
          customerId: user.id,
          status: orderData.status as OrderStatus,
          totalPrice: orderData.totalPrice,
          shippingPrice: orderData.shippingPrice,
          depositPaid: orderData.depositPaid,
          orderDate: new Date(orderData.orderDate)
        },
        create: {
          id: orderData.id,
          customerId: user.id,
          status: orderData.status as OrderStatus,
          totalPrice: orderData.totalPrice,
          shippingPrice: orderData.shippingPrice,
          depositPaid: orderData.depositPaid,
          orderDate: new Date(orderData.orderDate)
        }
      });

      // Create order details
      for (const detailData of orderData.details) {
        await prisma.customerOrderDetail.upsert({
          where: { id: detailData.id },
          update: {
            orderId: order.id,
            designId: detailData.designId,
            price: detailData.price,
            quantity: detailData.quantity,
            status: detailData.status as OrderStatus,
            qualityCheckStatus: detailData.qualityCheckStatus as QualityCheckStatus,
            reworkStatus: detailData.reworkStatus as ReworkStatus
          },
          create: {
            id: detailData.id,
            orderId: order.id,
            designId: detailData.designId,
            price: detailData.price,
            quantity: detailData.quantity,
            status: detailData.status as OrderStatus,
            qualityCheckStatus: detailData.qualityCheckStatus as QualityCheckStatus,
            reworkStatus: detailData.reworkStatus as ReworkStatus
          }
        });
      }
    }

    console.log('Customer orders seeded successfully!');
  } catch (error) {
    console.error('Error seeding customer orders:', error);
    throw error;
  }
}