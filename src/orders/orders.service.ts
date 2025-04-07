import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDetailStatus, OrderStatus, QualityCheckStatus, TaskStatus, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderInput: CreateOrderInput, userId: string) {
    // Validate order items
    if (!createOrderInput.orderDetails.length) {
      throw new BadRequestException("Order must contain at least one item");
    }

    // Get system config for order
    const systemConfig = await this.prisma.systemConfigOrder.findUnique({
      where: { type: 'SYSTEM_CONFIG_ORDER' }
    });

    if (!systemConfig) {
      throw new BadRequestException("System configuration not found");
    }

    return this.prisma.$transaction(async (tx) => {
      // Get cart items with all necessary relations
      const cartItems = await tx.cartItem.findMany({
        where: {
          id: { in: createOrderInput.orderDetails.map((v) => v.cartItemId) },
          userId: userId
        },
        include: {
          design: {
            include: {
              systemConfigVariant: {
                include: {
                  product: {
                    include: {
                      discounts: true
                    }
                  }
                }
              },
              designPositions: {
                include: {
                  positionType: true
                }
              }
            }
          }
        }
      });

      // Validate that all requested cart items were found
      if (cartItems.length !== createOrderInput.orderDetails.length) {
        throw new BadRequestException("Some cart items were not found");
      }

      let totalOrderPrice = 0;
      const orderDetailsToCreate = cartItems.map(cartItem => {
        const design = cartItem.design;
        
        // Calculate item price: variant price + sum of all position prices
        const blankPrice = design.systemConfigVariant.price || 0;
        const positionPrices = design.designPositions.reduce(
          (sum, position) => {
            if (position.designJSON && Object.keys(position.designJSON).length > 0) {
              return sum + position.positionType.basePrice;
            }
            return sum;
          },
          0
        );

        const baseItemPrice = blankPrice + positionPrices;

        // Get applicable discount based on quantity
        const discounts = design.systemConfigVariant.product.discounts || [];
        let maxDiscountPercent = 0;
        
        for (const discount of discounts) {
          if (cartItem.quantity >= discount.minQuantity && 
              discount.discountPercent > maxDiscountPercent) {
            maxDiscountPercent = discount.discountPercent;
          }
        }

        const itemPrice = baseItemPrice * (1 - maxDiscountPercent);
        const detailTotalPrice = itemPrice * cartItem.quantity;

        totalOrderPrice += detailTotalPrice;

        return {
          designId: design.id,
          quantity: cartItem.quantity,
          price: itemPrice,
          status: OrderDetailStatus.PENDING,
          completedQty: 0,
          rejectedQty: 0,
          reworkTime: 0,
          isRework: false
        };
      });

      // Calculate estimated times based on system config
      const now = new Date();
      const estimatedCheckQualityAt = new Date(now.getTime() + systemConfig.checkQualityTimesDays * 24 * 60 * 60 * 1000);
      const estimatedDoneProductionAt = new Date(now.getTime() + systemConfig.shippingDays * 24 * 60 * 60 * 1000);
      const estimatedCompletionAt = new Date(now.getTime() + (systemConfig.shippingDays + 2) * 24 * 60 * 60 * 1000);

      // Create the order
      const order = await tx.order.create({
        data: {
          customerId: userId,
          status: OrderStatus.PENDING,
          totalPrice: totalOrderPrice,
          shippingPrice: 0,
          orderDate: now,
          totalItems: cartItems.length,
          estimatedCheckQualityAt,
          estimatedDoneProductionAt,
          estimatedCompletionAt,
          estimatedShippingAt: estimatedDoneProductionAt,
          orderDetails: {
            create: orderDetailsToCreate
          },
          orderProgressReports: {
            create: {
              reportDate: now,
              note: "Order created",
              imageUrls: []
            }
          }
        },
        include: {
          orderDetails: true
        }
      });

      // Create payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          customerId: userId,
          amount: totalOrderPrice,
          type: 'DEPOSIT',
          paymentLog: "Initial deposit payment for order " + order.id,
          createdAt: now,
          status: 'PENDING'
        }
      });

      // Create tasks and check qualities for each order detail
      for (const orderDetail of order.orderDetails) {
        const task = await tx.task.create({
          data: {
            taskname: `Quality check for order ${order.id}`,
            description: `Quality check for design ${orderDetail.designId}`,
            startDate: now,
            expiredTime: estimatedCheckQualityAt,
            taskType: TaskType.QUALITY_CHECK,
            orderId: order.id,
            status: TaskStatus.PENDING
          }
        });

        await tx.checkQuality.create({
          data: {
            taskId: task.id,
            orderDetailId: orderDetail.id,
            totalChecked: 0,
            passedQuantity: 0,
            failedQuantity: 0,
            status: QualityCheckStatus.PENDING,
            checkedAt: now
          }
        });
      }

      // Remove the ordered items from the cart
      await tx.cartItem.deleteMany({
        where: {
          id: { in: createOrderInput.orderDetails.map(v => v.cartItemId) },
          userId: userId
        }
      });

      return order;
    });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderDetails: true,
        payments: true,
        orderProgressReports: true
      }
    });
  }

  async acceptOrderForFactory(orderId: string, factoryId: string) {
    const now = new Date();
    
    return this.prisma.$transaction(async (tx) => {
      // Get the order with its details
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          orderDetails: true
        }
      });

      if (!order) {
        throw new BadRequestException("Order not found");
      }

      if (order.factoryId !== factoryId) {
        throw new BadRequestException("This order is not assigned to your factory");
      }

      if (order.status !== OrderStatus.PENDING_ACCEPTANCE) {
        throw new BadRequestException("This order is not in PENDING_ACCEPTANCE status");
      }

      // Update order status and dates
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.IN_PRODUCTION,
          acceptedAt: now,
          orderProgressReports: {
            create: {
              reportDate: now,
              note: `Order accepted by factory ${factoryId} and production started`,
              imageUrls: []
            }
          }
        },
        include: {
          orderDetails: true
        }
      });

      // Update all order details status
      await tx.orderDetail.updateMany({
        where: {
          orderId: orderId
        },
        data: {
          status: OrderDetailStatus.IN_PRODUCTION,
        }
      });

      return updatedOrder;
    });
  }

  async rejectOrder(orderId: string, factoryId: string, reason: string) {
    const now = new Date();
    
    return this.prisma.$transaction(async (tx) => {
      // Get the order with its details
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          orderDetails: true
        }
      });

      if (!order) {
        throw new BadRequestException("Order not found");
      }

      if (order.factoryId !== factoryId) {
        throw new BadRequestException("This order is not assigned to your factory");
      }

      if (order.status !== OrderStatus.PENDING_ACCEPTANCE) {
        throw new BadRequestException("This order is not in PENDING_ACCEPTANCE status");
      }

      // Get system config for order
      const systemConfig = await tx.systemConfigOrder.findUnique({
        where: { type: 'SYSTEM_CONFIG_ORDER' }
      });

      if (!systemConfig) {
        throw new BadRequestException("System configuration not found");
      }

      // Create rejected order record
      await tx.rejectedOrder.create({
        data: {
          orderId,
          factoryId,
          reason,
          rejectedAt: now
        }
      });

      // Update factory legit points
      await tx.factory.update({
        where: { factoryOwnerId: factoryId },
        data: {
          legitPoint: {
            decrement: systemConfig.reduceLegitPointIfReject
          }
        }
      });

      // Update order status back to PAYMENT_RECEIVED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAYMENT_RECEIVED,
          factoryId: null,
          assignedAt: null,
          acceptanceDeadline: null,
          orderProgressReports: {
            create: {
              reportDate: now,
              note: `Order rejected by factory ${factoryId}. Reason: ${reason}`,
              imageUrls: []
            }
          }
        },
        include: {
          orderDetails: true
        }
      });

      return updatedOrder;
    });
  }
}
