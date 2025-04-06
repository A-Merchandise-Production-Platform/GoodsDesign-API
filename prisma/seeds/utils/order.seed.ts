import { PrismaClient, OrderStatus, OrderDetailStatus, QualityCheckStatus, PaymentType, PaymentStatus, TransactionType, TransactionStatus, PaymentMethod } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedOrders(prisma: PrismaClient) {
  console.log('🌱 Seeding orders...');

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerId: 'user-1', // Replace with actual user ID
        status: OrderStatus.PENDING,
        totalPrice: 1000000,
        shippingPrice: 50000,
        depositPaid: 300000,
        totalItems: 2,
        orderDetails: {
          create: [
            {
              designId: 'design-1', // Replace with actual design ID
              price: 500000,
              quantity: 2,
              status: OrderDetailStatus.PENDING,
              productionCost: 300000,
            },
          ],
        },
        payments: {
          create: [
            {
              customerId: 'user-1', // Replace with actual user ID
              amount: 300000,
              type: PaymentType.DEPOSIT,
              paymentLog: 'Initial deposit payment',
              createdAt: new Date(),
              status: PaymentStatus.COMPLETED,
              transactions: {
                create: [
                  {
                    customerId: 'user-1', // Replace with actual user ID
                    paymentGatewayTransactionId: faker.string.uuid(),
                    amount: 300000,
                    type: TransactionType.PAYMENT,
                    paymentMethod: PaymentMethod.VNPAY,
                    status: TransactionStatus.COMPLETED,
                    transactionLog: 'VNPAY transaction completed',
                    createdAt: new Date(),
                  },
                ],
              },
            },
          ],
        },
        history: {
          create: [
            {
              status: OrderStatus.PENDING,
              timestamp: new Date(),
              note: 'Order created',
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        customerId: 'user-2', // Replace with actual user ID
        factoryId: 'factory-1', // Replace with actual factory ID
        status: OrderStatus.IN_PRODUCTION,
        totalPrice: 2000000,
        shippingPrice: 50000,
        depositPaid: 600000,
        totalItems: 3,
        assignedAt: new Date(),
        acceptanceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        acceptedAt: new Date(),
        estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        orderDetails: {
          create: [
            {
              designId: 'design-2', // Replace with actual design ID
              price: 700000,
              quantity: 3,
              status: OrderDetailStatus.IN_PRODUCTION,
              completedQty: 1,
              productionCost: 400000,
            },
          ],
        },
        progressReports: {
          create: [
            {
              reportDate: new Date(),
              completed: 1,
              estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              notes: 'First batch completed',
              photoUrls: ['https://example.com/progress1.jpg'],
            },
          ],
        },
        tasks: {
          create: [
            {
              description: 'Quality check for first batch',
              taskname: 'Quality Check',
              startDate: new Date(),
              expiredTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              qualityCheckStatus: QualityCheckStatus.PENDING,
              taskType: 'QUALITY_CHECK',
              assignedBy: 'manager-1', // Replace with actual manager ID
              staffTasks: {
                create: [
                  {
                    userId: 'staff-1', // Replace with actual staff ID
                    assignedDate: new Date(),
                    status: 'PENDING',
                  },
                ],
              },
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Seeded ${orders.length} orders`);

  // Create quality checks for orders
  const qualityChecks = await Promise.all(
    orders.flatMap((order) =>
      order.orderDetails.map((detail) =>
        prisma.checkQuality.create({
          data: {
            taskId: order.tasks[0]?.id || '', // Assuming first task is quality check
            orderDetailId: detail.id,
            totalChecked: 10,
            passedQuantity: 8,
            failedQuantity: 2,
            status: QualityCheckStatus.PENDING,
            reworkRequired: false,
            checkedAt: new Date(),
            checkedBy: 'staff-1', // Replace with actual staff ID
          },
        }),
      ),
    ),
  );

  console.log(`✅ Seeded ${qualityChecks.length} quality checks`);

  // Create quality issues for orders
  const qualityIssues = await Promise.all(
    orders.map((order) =>
      prisma.qualityIssue.create({
        data: {
          orderId: order.id,
          reportedAt: new Date(),
          reportedBy: 'staff-1', // Replace with actual staff ID
          issueType: 'Printing Issue',
          description: 'Color mismatch in first batch',
          photoUrls: ['https://example.com/issue1.jpg'],
          status: 'REPORTED',
        },
      }),
    ),
  );

  console.log(`✅ Seeded ${qualityIssues.length} quality issues`);

  return {
    orders,
    qualityChecks,
    qualityIssues,
  };
} 