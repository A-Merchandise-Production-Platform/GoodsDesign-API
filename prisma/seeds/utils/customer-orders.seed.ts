import { PrismaClient } from '@prisma/client';
import { customerOrdersData } from '../data/customer-orders.data';

export async function seedCustomerOrders(prisma: PrismaClient) {
  try {
    console.log('Seeding customer orders...');

    for (const orderData of customerOrdersData.customerOrders) {
      // Find user by id
      const user = await prisma.user.findUnique({
        where: { id: orderData.customerId }
      });

      if (!user) {
        throw new Error(`User with id ${orderData.customerId} not found`);
      }

      // Create order
      const order = await prisma.customerOrder.upsert({
        where: { id: orderData.id },
        update: {
          customerId: user.id,
          status: orderData.status,
          totalPrice: orderData.totalPrice,
          shippingPrice: orderData.shippingPrice,
          depositPaid: orderData.depositPaid,
          orderDate: new Date(orderData.orderDate),
          rating: orderData.rating,
          ratingComment: orderData.ratingComment,
          ratedAt: orderData.ratedAt ? new Date(orderData.ratedAt) : null,
          ratedBy: orderData.ratedBy
        },
        create: {
          id: orderData.id,
          customerId: user.id,
          status: orderData.status,
          totalPrice: orderData.totalPrice,
          shippingPrice: orderData.shippingPrice,
          depositPaid: orderData.depositPaid,
          orderDate: new Date(orderData.orderDate),
          rating: orderData.rating,
          ratingComment: orderData.ratingComment,
          ratedAt: orderData.ratedAt ? new Date(orderData.ratedAt) : null,
          ratedBy: orderData.ratedBy
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
            status: detailData.status,
          },
          create: {
            id: detailData.id,
            orderId: order.id,
            designId: detailData.designId,
            price: detailData.price,
            quantity: detailData.quantity,
            status: detailData.status,
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