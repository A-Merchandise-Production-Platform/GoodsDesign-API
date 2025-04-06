import { OrderDetailStatus, OrderStatus, PrismaClient, QualityCheckStatus, SystemConfigOrderType, TaskStatus, TaskType } from '@prisma/client';
import { addDays } from 'date-fns';

export async function seedOrders(prisma: PrismaClient) {
  console.log('🌱 Seeding orders...');

  // Tìm customer để gán vào order
  const customer = await prisma.user.findFirst({
    where: { role: 'CUSTOMER' },
  });

  // Tìm factories để gán vào order
  const factories = await prisma.factory.findMany({
    take: 2
  });

  // Tìm designs để gán vào order details
  const designs = await prisma.productDesign.findMany({
    take: 3
  });

  // Tìm staff để gán vào tasks
  const staff = await prisma.user.findFirst({
    where: { role: 'STAFF' },
  });

  if (!customer || !factories.length || !designs.length) {
    console.log('⚠️ Missing required data (customers, factories, or designs). Skipping order seeding.');
    return;
  }

  // Lấy thông tin cấu hình
  const { checkQualityTimesDays, shippingDays} = await prisma.systemConfigOrder.upsert({
    where: {
      type: SystemConfigOrderType.SYSTEM_CONFIG_ORDER
    },
    update: {},
    create: {
      type: SystemConfigOrderType.SYSTEM_CONFIG_ORDER,
    }
  });

  const now = new Date();
  
  // Tính toán các thời gian dự kiến
  const estimatedDoneProductionAt = addDays(now, 7); // giả sử 7 ngày sản xuất
  const estimatedCheckQualityAt = addDays(estimatedDoneProductionAt, checkQualityTimesDays);
  const estimatedShippingAt = addDays(estimatedCheckQualityAt, 1);
  const estimatedCompletionAt = addDays(estimatedShippingAt, shippingDays);

  // Array để lưu trữ ID của orders đã tạo
  const orderIds = [];

  // 1. Tạo Order ở trạng thái PENDING
  const pendingOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: OrderStatus.PENDING,
      totalPrice: 1500000,
      shippingPrice: 50000,
      totalItems: 3,
      estimatedDoneProductionAt,
      estimatedCheckQualityAt,
      estimatedShippingAt,
      estimatedCompletionAt,
      orderDetails: {
        create: [
          {
            designId: designs[0].id,
            price: 500000,
            quantity: 10,
          }
        ]
      }
    }
  });
  orderIds.push(pendingOrder.id);

  // 2. Tạo Order ở trạng thái PAYMENT_RECEIVED
  const paymentReceivedOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: OrderStatus.PAYMENT_RECEIVED,
      totalPrice: 2000000,
      shippingPrice: 50000,
      totalItems: 5,
      estimatedDoneProductionAt,
      estimatedCheckQualityAt,
      estimatedShippingAt,
      estimatedCompletionAt,
      orderDetails: {
        create: [
          {
            designId: designs[1].id,
            price: 400000,
            quantity: 5,
          }
        ]
      },
      payments: {
        create: {
          customerId: customer.id,
          amount: 600000, // đặt cọc 30%
          type: 'DEPOSIT',
          paymentLog: 'Payment received via VNPay',
          createdAt: now,
          status: 'COMPLETED'
        }
      }
    }
  });
  orderIds.push(paymentReceivedOrder.id);

  // 3. Tạo Order ở trạng thái IN_PRODUCTION
  const inProductionOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      factoryId: factories[0].factoryOwnerId,
      status: OrderStatus.IN_PRODUCTION,
      totalPrice: 3000000,
      shippingPrice: 50000,
      totalItems: 7,
      estimatedDoneProductionAt,
      estimatedCheckQualityAt,
      estimatedShippingAt,
      estimatedCompletionAt,
      assignedAt: addDays(now, -5),
      acceptanceDeadline: addDays(now, -4),
      acceptedAt: addDays(now, -4),
      currentProgress: 50,
      orderDetails: {
        create: [
          {
            designId: designs[0].id,
            price: 700000,
            quantity: 3,
            status: OrderDetailStatus.IN_PRODUCTION,
            completedQty: 1
          },
          {
            designId: designs[1].id,
            price: 800000,
            quantity: 4,
            status: OrderDetailStatus.IN_PRODUCTION,
            completedQty: 2
          }
        ]
      },
      payments: {
        create: {
          customerId: customer.id,
          amount: 900000, // đặt cọc 30%
          type: 'DEPOSIT',
          paymentLog: 'Payment received via VNPay',
          createdAt: addDays(now, -6),
          status: 'COMPLETED'
        }
      },
      orderProgressReports: {
        create: [
          {
            reportDate: addDays(now, -3),
            note: 'Production started, materials prepared',
            imageUrls: ['https://example.com/image1.jpg']
          },
          {
            reportDate: addDays(now, -1),
            note: 'Production at 50% completion',
            imageUrls: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg']
          }
        ]
      }
    }
  });
  orderIds.push(inProductionOrder.id);

  // 4. Tạo Order ở trạng thái WAITING_FOR_CHECKING_QUALITY với task kiểm tra chất lượng
  const waitingQualityOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      factoryId: factories[0].factoryOwnerId,
      status: OrderStatus.WAITING_FOR_CHECKING_QUALITY,
      totalPrice: 2500000,
      shippingPrice: 50000,
      totalItems: 5,
      estimatedDoneProductionAt: addDays(now, -1),
      doneProductionAt: addDays(now, -1),
      estimatedCheckQualityAt: addDays(now, 1),
      estimatedShippingAt,
      estimatedCompletionAt,
      assignedAt: addDays(now, -8),
      acceptanceDeadline: addDays(now, -7),
      acceptedAt: addDays(now, -7),
      currentProgress: 100,
      orderDetails: {
        create: [
          {
            designId: designs[0].id,
            price: 500000,
            quantity: 5,
            status: OrderDetailStatus.WAITING_FOR_CHECKING_QUALITY,
            completedQty: 5
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Quality check for Order',
          description: 'Perform quality check on all items in the order',
          taskType: TaskType.QUALITY_CHECK,
          startDate: now,
          expiredTime: addDays(now, checkQualityTimesDays),
          status: TaskStatus.PENDING,
          userId: staff ? staff.id : null
        }
      }
    }
  });
  orderIds.push(waitingQualityOrder.id);

  // Tìm task vừa tạo để tạo CheckQuality
  const qualityTask = await prisma.task.findFirst({
    where: { orderId: waitingQualityOrder.id }
  });

  if (qualityTask) {
    // Tìm order detail để tạo CheckQuality
    const orderDetail = await prisma.orderDetail.findFirst({
      where: { orderId: waitingQualityOrder.id }
    });

    if (orderDetail) {
      // Tạo CheckQuality
      await prisma.checkQuality.create({
        data: {
          taskId: qualityTask.id,
          orderDetailId: orderDetail.id,
          totalChecked: 0,
          status: QualityCheckStatus.PENDING,
          checkedAt: now,
          imageUrls: []
        }
      });
    }
  }

  // 5. Tạo Order ở trạng thái COMPLETED
  const completedOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      factoryId: factories[0].factoryOwnerId,
      status: OrderStatus.COMPLETED,
      totalPrice: 1800000,
      shippingPrice: 50000,
      totalItems: 4,
      estimatedDoneProductionAt: addDays(now, -15),
      doneProductionAt: addDays(now, -15),
      estimatedCheckQualityAt: addDays(now, -13),
      doneCheckQualityAt: addDays(now, -13),
      estimatedShippingAt: addDays(now, -12),
      shippedAt: addDays(now, -12),
      estimatedCompletionAt: addDays(now, -10),
      completedAt: addDays(now, -10),
      assignedAt: addDays(now, -20),
      acceptanceDeadline: addDays(now, -19),
      acceptedAt: addDays(now, -19),
      currentProgress: 100,
      rating: 5,
      ratingComment: 'Excellent quality and service!',
      ratedAt: addDays(now, -9),
      ratedBy: customer.id,
      orderDetails: {
        create: [
          {
            designId: designs[0].id,
            price: 450000,
            quantity: 4,
            status: OrderDetailStatus.COMPLETED,
            completedQty: 4
          }
        ]
      },
      payments: {
        create: [
          {
            customerId: customer.id,
            amount: 1800000,
            type: 'DEPOSIT',
            paymentLog: 'Initial deposit via VNPay',
            createdAt: addDays(now, -21),
            status: 'COMPLETED'
          },
        ]
      }
    }
  });
  orderIds.push(completedOrder.id);

  // 6. Tạo Order bị từ chối
  const rejectedOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: OrderStatus.REJECTED,
      totalPrice: 2200000,
      shippingPrice: 50000,
      totalItems: 6,
      estimatedDoneProductionAt,
      estimatedCheckQualityAt,
      estimatedShippingAt,
      estimatedCompletionAt,
      orderDetails: {
        create: [
          {
            designId: designs[2].id,
            price: 370000,
            quantity: 6,
          }
        ]
      },
      payments: {
        create: {
          customerId: customer.id,
          amount: 660000, // đặt cọc 30%
          type: 'DEPOSIT',
          paymentLog: 'Payment received via VNPay',
          createdAt: addDays(now, -4),
          status: 'COMPLETED'
        }
      },
      rejectedHistory: {
        create: {
          factoryId: factories[0].factoryOwnerId,
          reason: 'Factory at full capacity',
          rejectedAt: addDays(now, -2)
        }
      }
    }
  });
  orderIds.push(rejectedOrder.id);

  console.log(`✅ Seeded ${orderIds.length} orders with related data`);
  return orderIds;
}