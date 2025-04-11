import { OrderDetailStatus, OrderStatus, PrismaClient, QualityCheckStatus, SystemConfigOrderType, TaskStatus, TaskType } from '@prisma/client';
import { addDays } from 'date-fns';
import { usersData } from '../data/users.data';
import { productDesignsData } from '../data/product-designs.data';
import { variantsData } from '../data/system-config-variants.data';
import { positionTypesData } from '../data/product-position-types.data';
import { designPositionsData } from '../data/design-positions.data';

export async function seedOrders(prisma: PrismaClient) {
  console.log('🌱 Seeding orders...');

  // Get customer from seed data
  const customer = await prisma.user.findFirst({
    where: { email: usersData.users.find(u => u.role === 'CUSTOMER')?.email }
  });

  // Get factories from database
  const factories = await prisma.factory.findMany({
    take: 2
  });

  // Get designs from seed data
  const designs = await prisma.productDesign.findMany({
    where: {
      id: {
        in: productDesignsData.productDesigns.map(d => d.id)
      }
    },
    take: 3
  });

  // Get staff from seed data
  const staff = await prisma.user.findFirst({
    where: { email: usersData.users.find(u => u.role === 'STAFF')?.email }
  });

  if (!customer || !factories.length || !designs.length) {
    console.log('⚠️ Missing required data (customers, factories, or designs). Skipping order seeding.');
    return;
  }

  // Get system config
  const { checkQualityTimesDays, shippingDays } = await prisma.systemConfigOrder.upsert({
    where: {
      type: SystemConfigOrderType.SYSTEM_CONFIG_ORDER
    },
    update: {},
    create: {
      type: SystemConfigOrderType.SYSTEM_CONFIG_ORDER,
    }
  });

  const now = new Date();
  
  // Calculate estimated times
  const estimatedDoneProductionAt = addDays(now, 7);
  const estimatedCheckQualityAt = addDays(estimatedDoneProductionAt, checkQualityTimesDays);
  const estimatedShippingAt = addDays(estimatedCheckQualityAt, 1);
  const estimatedCompletionAt = addDays(estimatedShippingAt, shippingDays);

  // Array to store created order IDs
  const orderIds = [];

  // Calculate prices based on variant and position types
  const variantPrice = variantsData.variants[0].price; // 50000
  const frontPositionPrice = positionTypesData.positionTypes[0].basePrice; // 100000
  const backPositionPrice = positionTypesData.positionTypes[1].basePrice; // 100000
  const sleevePositionPrice = positionTypesData.positionTypes[2].basePrice; // 50000

  // Helper function to calculate design price based on design positions
  const calculateDesignPrice = (designId: string) => {
    let totalPrice = variantPrice;
    const designPositions = designPositionsData.designPositions.filter(dp => dp.designId === designId);
    
    for (const dp of designPositions) {
      if (dp.designJSON.length > 0) {
        switch (dp.productPositionTypeId) {
          case 'front001':
            totalPrice += frontPositionPrice;
            break;
          case 'back001':
            totalPrice += backPositionPrice;
            break;
          case 'leftSleeve001':
          case 'rightSleeve001':
            totalPrice += sleevePositionPrice;
            break;
        }
      }
    }
    
    return totalPrice;
  };

  // 1. Create PENDING order - 1 product with front print
  const pendingOrderPrice = calculateDesignPrice(designs[0].id);
  const pendingOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: OrderStatus.PENDING,
      totalPrice: pendingOrderPrice * 10,
      shippingPrice: 50000,
      totalItems: 10,
      estimatedDoneProductionAt,
      estimatedCheckQualityAt,
      estimatedShippingAt,
      estimatedCompletionAt,
      orderDetails: {
        create: [
          {
            designId: designs[0].id,
            price: pendingOrderPrice,
            quantity: 10,
          }
        ]
      },
      orderProgressReports: {
        create: [
          {
            reportDate: now,
            note: 'Order created and waiting for payment',
            imageUrls: []
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Initial order review',
          description: 'Review order details and prepare for production',
          taskType: TaskType.QUALITY_CHECK,
          startDate: now,
          expiredTime: addDays(now, 1),
          status: TaskStatus.PENDING,
          userId: staff ? staff.id : null
        }
      }
    }
  });

  // Create CheckQuality for pending order
  const pendingOrderDetail = await prisma.orderDetail.findFirst({
    where: { orderId: pendingOrder.id }
  });
  const pendingTask = await prisma.task.findFirst({
    where: { orderId: pendingOrder.id }
  });

  if (pendingOrderDetail && pendingTask) {
    await prisma.checkQuality.create({
      data: {
        taskId: pendingTask.id,
        orderDetailId: pendingOrderDetail.id,
        totalChecked: 0,
        status: QualityCheckStatus.PENDING,
        checkedAt: now,
        imageUrls: []
      }
    });
  }

  orderIds.push(pendingOrder.id);

  // 2. Create PAYMENT_RECEIVED order - 1 product with front and back print
  const paymentReceivedOrderPrice = calculateDesignPrice(designs[1].id);
  const paymentReceivedOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: OrderStatus.PAYMENT_RECEIVED,
      totalPrice: paymentReceivedOrderPrice * 5,
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
            price: paymentReceivedOrderPrice,
            quantity: 5,
          }
        ]
      },
      payments: {
        create: {
          customerId: customer.id,
          amount: paymentReceivedOrderPrice * 5,
          type: 'DEPOSIT',
          paymentLog: 'Payment received via VNPay',
          createdAt: now,
          status: 'COMPLETED'
        }
      },
      orderProgressReports: {
        create: [
          {
            reportDate: now,
            note: 'Order created and payment received',
            imageUrls: []
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Payment verification',
          description: 'Verify payment and prepare for production',
          taskType: TaskType.QUALITY_CHECK,
          startDate: now,
          expiredTime: addDays(now, 1),
          status: TaskStatus.PENDING,
          userId: staff ? staff.id : null
        }
      }
    }
  });

  // Create CheckQuality for payment received order
  const paymentReceivedOrderDetail = await prisma.orderDetail.findFirst({
    where: { orderId: paymentReceivedOrder.id }
  });
  const paymentReceivedTask = await prisma.task.findFirst({
    where: { orderId: paymentReceivedOrder.id }
  });

  if (paymentReceivedOrderDetail && paymentReceivedTask) {
    await prisma.checkQuality.create({
      data: {
        taskId: paymentReceivedTask.id,
        orderDetailId: paymentReceivedOrderDetail.id,
        totalChecked: 0,
        status: QualityCheckStatus.PENDING,
        checkedAt: now,
        imageUrls: []
      }
    });
  }

  orderIds.push(paymentReceivedOrder.id);

  // 3. Create IN_PRODUCTION order - 2 products with different prints
  const inProductionOrderPrice1 = calculateDesignPrice(designs[0].id);
  const inProductionOrderPrice2 = calculateDesignPrice(designs[1].id);
  const inProductionOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      factoryId: factories[0].factoryOwnerId,
      status: OrderStatus.IN_PRODUCTION,
      totalPrice: (inProductionOrderPrice1 * 3) + (inProductionOrderPrice2 * 4),
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
            price: inProductionOrderPrice1,
            quantity: 3,
            status: OrderDetailStatus.IN_PRODUCTION,
            completedQty: 1
          },
          {
            designId: designs[1].id,
            price: inProductionOrderPrice2,
            quantity: 4,
            status: OrderDetailStatus.IN_PRODUCTION,
            completedQty: 2
          }
        ]
      },
      payments: {
        create: {
          customerId: customer.id,
          amount: (inProductionOrderPrice1 * 3) + (inProductionOrderPrice2 * 4),
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
            imageUrls: ['https://loremflickr.com/200/200?random=1']
          },
          {
            reportDate: addDays(now, -1),
            note: 'Production at 50% completion',
            imageUrls: ['https://loremflickr.com/200/200?random=1', 'https://loremflickr.com/200/200?random=1']
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Production quality check',
          description: 'Monitor production quality and progress',
          taskType: TaskType.QUALITY_CHECK,
          startDate: now,
          expiredTime: addDays(now, 2),
          status: TaskStatus.IN_PROGRESS,
          userId: staff ? staff.id : null
        }
      }
    }
  });

  // Create CheckQuality for in production order
  const inProductionOrderDetails = await prisma.orderDetail.findMany({
    where: { orderId: inProductionOrder.id }
  });
  const inProductionTask = await prisma.task.findFirst({
    where: { orderId: inProductionOrder.id }
  });

  if (inProductionOrderDetails.length > 0 && inProductionTask) {
    for (const orderDetail of inProductionOrderDetails) {
      await prisma.checkQuality.create({
        data: {
          taskId: inProductionTask.id,
          orderDetailId: orderDetail.id,
          totalChecked: orderDetail.completedQty,
          status: QualityCheckStatus.PENDING,
          checkedAt: now,
          imageUrls: []
        }
      });
    }
  }

  orderIds.push(inProductionOrder.id);

  // 4. Create WAITING_FOR_CHECKING_QUALITY order with quality check task
  const waitingQualityOrderPrice = calculateDesignPrice(designs[0].id);
  const waitingQualityOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      factoryId: factories[0].factoryOwnerId,
      status: OrderStatus.WAITING_FOR_CHECKING_QUALITY,
      totalPrice: waitingQualityOrderPrice * 5,
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
            price: waitingQualityOrderPrice,
            quantity: 5,
            status: OrderDetailStatus.WAITING_FOR_CHECKING_QUALITY,
            completedQty: 5
          }
        ]
      },
      orderProgressReports: {
        create: [
          {
            reportDate: addDays(now, -1),
            note: 'Production completed, waiting for quality check',
            imageUrls: ['https://loremflickr.com/200/200?random=1']
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Final quality check',
          description: 'Perform final quality check on all items',
          taskType: TaskType.QUALITY_CHECK,
          startDate: now,
          expiredTime: addDays(now, checkQualityTimesDays),
          status: TaskStatus.PENDING,
          userId: staff ? staff.id : null
        }
      }
    }
  });

  // Create CheckQuality for waiting quality order
  const waitingQualityOrderDetail = await prisma.orderDetail.findFirst({
    where: { orderId: waitingQualityOrder.id }
  });
  const waitingQualityTask = await prisma.task.findFirst({
    where: { orderId: waitingQualityOrder.id }
  });

  if (waitingQualityOrderDetail && waitingQualityTask) {
    await prisma.checkQuality.create({
      data: {
        taskId: waitingQualityTask.id,
        orderDetailId: waitingQualityOrderDetail.id,
        totalChecked: 0,
        status: QualityCheckStatus.PENDING,
        checkedAt: now,
        imageUrls: []
      }
    });
  }

  orderIds.push(waitingQualityOrder.id);

  // 5. Create COMPLETED order
  const completedOrderPrice = calculateDesignPrice(designs[0].id);
  const completedOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      factoryId: factories[0].factoryOwnerId,
      status: OrderStatus.COMPLETED,
      totalPrice: completedOrderPrice * 4,
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
            price: completedOrderPrice,
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
            amount: completedOrderPrice * 4,
            type: 'DEPOSIT',
            paymentLog: 'Initial deposit via VNPay',
            createdAt: addDays(now, -21),
            status: 'COMPLETED'
          },
        ]
      },
      orderProgressReports: {
        create: [
          {
            reportDate: addDays(now, -15),
            note: 'Production completed',
            imageUrls: ['https://loremflickr.com/200/200?random=1']
          },
          {
            reportDate: addDays(now, -13),
            note: 'Quality check passed',
            imageUrls: ['https://loremflickr.com/200/200?random=1']
          },
          {
            reportDate: addDays(now, -12),
            note: 'Order shipped',
            imageUrls: ['https://loremflickr.com/200/200?random=1']
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Order completion review',
          description: 'Review completed order and customer feedback',
          taskType: TaskType.QUALITY_CHECK,
          startDate: addDays(now, -10),
          expiredTime: addDays(now, -9),
          status: TaskStatus.COMPLETED,
          userId: staff ? staff.id : null,
          completedDate: addDays(now, -9)
        }
      }
    }
  });

  // Create CheckQuality for completed order
  const completedOrderDetail = await prisma.orderDetail.findFirst({
    where: { orderId: completedOrder.id }
  });
  const completedTask = await prisma.task.findFirst({
    where: { orderId: completedOrder.id }
  });

  if (completedOrderDetail && completedTask) {
    await prisma.checkQuality.create({
      data: {
        taskId: completedTask.id,
        orderDetailId: completedOrderDetail.id,
        totalChecked: completedOrderDetail.quantity,
        passedQuantity: completedOrderDetail.quantity,
        failedQuantity: 0,
        status: QualityCheckStatus.APPROVED,
        checkedAt: addDays(now, -13),
        checkedBy: staff ? staff.id : null,
        imageUrls: ['https://loremflickr.com/200/200?random=1']
      }
    });
  }

  orderIds.push(completedOrder.id);

  // 6. Create REJECTED order
  const rejectedOrderPrice = calculateDesignPrice(designs[2].id);
  const rejectedOrder = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: OrderStatus.REJECTED,
      totalPrice: rejectedOrderPrice * 6,
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
            price: rejectedOrderPrice,
            quantity: 6,
          }
        ]
      },
      payments: {
        create: {
          customerId: customer.id,
          amount: rejectedOrderPrice * 6,
          type: 'DEPOSIT',
          paymentLog: 'Payment received via VNPay',
          createdAt: addDays(now, -4),
          status: 'COMPLETED'
        }
      },
      orderProgressReports: {
        create: [
          {
            reportDate: addDays(now, -2),
            note: 'Order rejected by factory',
            imageUrls: []
          }
        ]
      },
      tasks: {
        create: {
          taskname: 'Order rejection review',
          description: 'Review rejected order and handle refund',
          taskType: TaskType.QUALITY_CHECK,
          startDate: addDays(now, -2),
          expiredTime: addDays(now, -1),
          status: TaskStatus.COMPLETED,
          userId: staff ? staff.id : null,
          completedDate: addDays(now, -1)
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

  // Create CheckQuality for rejected order
  const rejectedOrderDetail = await prisma.orderDetail.findFirst({
    where: { orderId: rejectedOrder.id }
  });
  const rejectedTask = await prisma.task.findFirst({
    where: { orderId: rejectedOrder.id }
  });

  if (rejectedOrderDetail && rejectedTask) {
    await prisma.checkQuality.create({
      data: {
        taskId: rejectedTask.id,
        orderDetailId: rejectedOrderDetail.id,
        totalChecked: 0,
        status: QualityCheckStatus.REJECTED,
        checkedAt: addDays(now, -2),
        checkedBy: staff ? staff.id : null,
        note: 'Order rejected due to factory capacity',
        imageUrls: []
      }
    });
  }

  orderIds.push(rejectedOrder.id);

  console.log(`✅ Seeded ${orderIds.length} orders with related data`);
  return orderIds;
}