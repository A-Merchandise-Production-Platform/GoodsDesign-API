import { AlgorithmService } from '@/algorithm/algorithm.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FactoryStatus, OrderDetailStatus, OrderStatus, PaymentStatus, Roles, TaskStatus, TaskType } from '@prisma/client';
import { FactoryService } from 'src/factory/factory.service';
import { PaymentTransactionService } from 'src/payment-transaction/payment-transaction.service';
import { PrismaService } from 'src/prisma';
import { UserEntity } from 'src/users';

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name)

  constructor(
    private prisma: PrismaService,
    private paymentTransactionService: PaymentTransactionService,
    private factoryService: FactoryService,
    private algorithmService: AlgorithmService,
    private notificationsService: NotificationsService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: "checkPaymentTransactionIsNotCompleted"
  })
  async checkPaymentTransactionIsNotCompleted() {
    await this.paymentTransactionService.checkPaymentTransactionIsNotCompleted()
  }

  @Cron(CronExpression.EVERY_SECOND, {
    name: "checkPaymentReceivedOrderForAssignIntoFactory"
  })
  async checkPaymentReceivedOrderForAssignIntoFactoryCRON() {
    await this.checkPaymentReceivedOrderForAssignIntoFactory()
  }

  @Cron(CronExpression.EVERY_SECOND, {
    name: "checkFirstPaymentToChangeStatusOfOrderIntoPaymentReceived"
  })
  async checkFirstPaymentToChangeStatusOfOrderIntoPaymentReceivedCRON() {
    await this.checkFirstPaymentToChangeStatusOfOrderIntoPaymentReceived()
  }

  public async checkFirstPaymentToChangeStatusOfOrderIntoPaymentReceived(): Promise<void> {
    try {
      // Get system configuration
      //get all orders with status PENDING
      const orders = await this.prisma.order.findMany({
        where: {
          status: OrderStatus.PENDING
        }
      }) 

      for (const order of orders) {
        const payment = await this.prisma.payment.findMany({
          where: {
            orderId: order.id,
          }
        })

        if (payment.length == 1){
          //check if payment is success
          if (payment[0].status == PaymentStatus.COMPLETED){
            await this.prisma.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus.PAYMENT_RECEIVED
              }
            })
          }
        }
      }
    } catch (error) {
    }
  }
      
      
      
      
  


  public async checkPaymentReceivedOrderForAssignIntoFactory(): Promise<void> {
    try {
        // Get system configuration
        const systemConfig = await this.prisma.systemConfigOrder.findFirst({
            where: {
                type: "SYSTEM_CONFIG_ORDER"
            }
        })

        if (!systemConfig) {
            return
        }

        // Find orders with PAYMENT_RECEIVED status that don't already have factory orders
        const orders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.PAYMENT_RECEIVED,
                factoryId: null // Ensure no factory is assigned yet
            },
            include: {
                orderDetails: {
                    include: {
                        design: {
                            include: {
                                systemConfigVariant: true
                            }
                        }
                    }
                },
                rejectedHistory: true
            }
        })

        if (orders.length === 0) {
            return
        }

        // Process each order individually
        for (const order of orders) {
            // Check if order has been rejected too many times
            if (order.rejectedHistory.length >= systemConfig.limitFactoryRejectOrders) {
              // noti for manager
              await this.notificationsService.createForUsersByRoles({
                title: "Order Rejected",
                content: `Order #${order.id} has been rejected ${order.rejectedHistory.length} times. Manual assignment required.`,
                roles: [Roles.MANAGER],
                url: `/manager/orders/${order.id}`
              })

                // Update order status to NEED_MANAGER_HANDLE
                await this.prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: OrderStatus.NEED_MANAGER_HANDLE,
                        orderProgressReports: {
                            create: {
                                reportDate: new Date(),
                                note: `Order has been rejected ${order.rejectedHistory.length} times. Manual assignment required.`,
                                imageUrls: []
                            }
                        }
                    }
                })
                continue
            }

            await this.processOrderForFactoryAssignment(order)
        }
    } catch (error) {
        this.logger.error(`Error in factory assignment cron job: ${error.message}`)
        throw error
    }
  }

  private async processOrderForFactoryAssignment(order: any): Promise<void> {
      try {
          // Extract all variant IDs from this order
          const variantIds = order.orderDetails.map(
              (detail) => detail.design.systemConfigVariantId
          ) as string[]
          const uniqueVariantIds = [...new Set(variantIds)]

          // Calculate total items
          const totalItems = order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)

          // Find the best factory for this order, excluding previously rejecting factories
          const selectedFactory = await this.algorithmService.findBestFactoryForVariants(uniqueVariantIds, order.id)

          if (!selectedFactory) {
              // Update order status to NEED_MANAGER_HANDLE
              await this.prisma.order.update({
                  where: { id: order.id },
                  data: {
                      status: OrderStatus.NEED_MANAGER_HANDLE,
                      orderProgressReports: {
                          create: {
                              reportDate: new Date(),
                              note: "No suitable factory found for order. Manual assignment required.",
                              imageUrls: []
                          }
                      }
                  }
              })
              return
          }

          // Get system configuration values
          const systemConfig = await this.prisma.systemConfigOrder.findFirst({
              where: {
                  type: "SYSTEM_CONFIG_ORDER"
              }
          })

          if (!systemConfig) {
              return
          }

          // Calculate production costs for each order detail
          let totalProductionCost = 0
          const orderDetailsWithCost = await Promise.all(
              order.orderDetails.map(async (detail) => {
                  // Find the factory product for this variant
                  const factoryProduct = selectedFactory.products.find(
                      (p) => p.systemConfigVariantId === detail.design.systemConfigVariantId
                  )

                  if (!factoryProduct) {
                      return {
                          ...detail,
                          productionCost: 0
                      }
                  }

                  // Calculate production cost (base rate x quantity)
                  const baseCostPerUnit = factoryProduct.productionTimeInMinutes * 10000 // Cost calculation based on time
                  const detailProductionCost = baseCostPerUnit * detail.quantity

                  totalProductionCost += detailProductionCost

                  return {
                      ...detail,
                      productionCost: detailProductionCost
                  }
              })
          )

          // Get acceptance hours for factory
          const { acceptHoursForFactory } = await this.prisma.systemConfigOrder.findFirst({
            where: {
              type: "SYSTEM_CONFIG_ORDER"
            }
          })

          const acceptanceDeadline = new Date()
          acceptanceDeadline.setHours(acceptanceDeadline.getHours() + acceptHoursForFactory)

          // Calculate estimated times based on system configuration
          const now = new Date()
          const estimatedDoneProductionAt = new Date(now.getTime() + (systemConfig.checkQualityTimesDays - 2) * 24 * 60 * 60 * 1000)
          const estimatedCheckQualityAt = new Date(now.getTime() + systemConfig.checkQualityTimesDays * 24 * 60 * 60 * 1000)
          const estimatedCompletionAt = new Date(now.getTime() + (systemConfig.checkQualityTimesDays + systemConfig.shippingDays) * 24 * 60 * 60 * 1000)
          const estimatedShippingAt = new Date(now.getTime() + (systemConfig.checkQualityTimesDays + systemConfig.shippingDays) * 24 * 60 * 60 * 1000)

          // Use transaction to ensure atomicity
          await this.prisma.$transaction(async (tx) => {
              // Update order with factory assignment and status
              await tx.order.update({
                  where: { id: order.id },
                  data: {
                      factoryId: selectedFactory.factoryOwnerId,
                      status: OrderStatus.PENDING_ACCEPTANCE,
                      assignedAt: now,
                      acceptanceDeadline,
                      totalItems,
                      totalProductionCost,
                      estimatedDoneProductionAt,
                      estimatedCheckQualityAt,
                      estimatedCompletionAt,
                      estimatedShippingAt
                  }
              })

              // Create notification for factory owner
              await tx.notification.create({
                  data: {
                      userId: selectedFactory.owner.id,
                      title: "New Order Assignment",
                      content: `You have been assigned a new order #${order.id} with ${totalItems} items.`,
                      url: `/factory/orders/${order.id}`
                  }
              })
          })
      } catch (error) {
          this.logger.error(`Error processing order ${order.id}: ${error.message}`)
      }
  }


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: "cleanupOldNotifications"
  })
  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Delete notifications older than 30 days
    await this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: "checkExpiredTasks"
  })
  async checkExpiredTasks() {
    const now = new Date();
    
    // Find tasks that have exceeded their expiration time
    const expiredTasks = await this.prisma.task.findMany({
      where: {
        status: {
          in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]
        },
        expiredTime: {
          lt: now
        }
      },
      include: {
        order: true
      }
    });
    
    // Update expired tasks
    for (const task of expiredTasks) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: {
          status: TaskStatus.EXPIRED,
          note: "Task automatically expired due to exceeding deadline"
        }
      });
      
      // If this is a quality check task, update the order status
      if (task.taskType === TaskType.QUALITY_CHECK && task.orderId) {
        await this.prisma.order.update({
          where: { id: task.orderId },
          data: {
            isDelayed: true,
            delayReason: "Quality check task expired",
            orderProgressReports: {
              create: {
                reportDate: now,
                note: "Quality check task expired, causing order delay",
                imageUrls: []
              }
            }
          }
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: "checkPendingAcceptanceOrders"
  })
  async checkPendingAcceptanceOrders() {
    const now = new Date();
    const expiredOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_ACCEPTANCE,
        acceptanceDeadline: {
          lt: now
        }
      },
      include: {
        factory: true
      }
    });
    
    // Process each expired order
    for (const order of expiredOrders) {
      await this.prisma.$transaction(async (tx) => {
        // Create rejected order record
        await tx.rejectedOrder.create({
          data: {
            orderId: order.id,
            factoryId: order.factoryId,
            reason: "Factory did not respond within the acceptance deadline",
            rejectedAt: now
          }
        });
        
        // Update factory legit points
        const systemConfig = await tx.systemConfigOrder.findFirst({
          where: { type: "SYSTEM_CONFIG_ORDER" }
        });
        
        if (systemConfig && order.factoryId) {
          await tx.factory.update({
            where: { factoryOwnerId: order.factoryId },
            data: {
              legitPoint: {
                decrement: systemConfig.reduceLegitPointIfReject
              }
            }
          });
        }
        
        // Update order status back to PAYMENT_RECEIVED
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.PAYMENT_RECEIVED,
            factoryId: null,
            assignedAt: null,
            acceptanceDeadline: null,
            orderProgressReports: {
              create: {
                reportDate: now,
                note: `Order automatically rejected due to factory not responding within deadline`,
                imageUrls: []
              }
            }
          }
        });
      });
    }
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: "checkFactoryLegitimacyPoints"
  })
  async checkFactoryLegitimacyPointsCRON() {
    await this.checkFactoryLegitimacyPoints()
  }

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: "checkShippedOrdersForCompletion"
  })
  async checkShippedOrdersForCompletionCRON() {
    await this.checkShippedOrdersForCompletion()
  }

  public async checkShippedOrdersForCompletion(): Promise<void> {
    try {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Find all orders with SHIPPED status
      const shippedOrders = await this.prisma.order.findMany({
        where: {
          status: OrderStatus.SHIPPED
        }
      })

      for (const order of shippedOrders) {
        // Check if customer has provided feedback
        if (order.rating !== null && order.ratedAt !== null) {
          // Customer has provided feedback, update order to COMPLETED
          await this.prisma.order.update({
            where: { id: order.id },
            data: {
              status: OrderStatus.COMPLETED,
              completedAt: now,
              currentProgress: 100,
              orderProgressReports: {
                create: {
                  reportDate: now,
                  note: `Order completed with customer feedback. Rating: ${order.rating}${order.ratingComment ? `, Comment: ${order.ratingComment}` : ''}`,
                  imageUrls: []
                }
              }
            }
          })

          // Update all order details to COMPLETED
          await this.prisma.orderDetail.updateMany({
            where: { orderId: order.id },
            data: {
              status: OrderDetailStatus.COMPLETED
            }
          })
        } 
        // Check if order has been shipped for more than 7 days
        else if (order.shippedAt && order.shippedAt < sevenDaysAgo) {
          // Order has been shipped for more than 7 days, auto-complete it
          await this.prisma.order.update({
            where: { id: order.id },
            data: {
              status: OrderStatus.COMPLETED,
              completedAt: now,
              currentProgress: 100,
              orderProgressReports: {
                create: {
                  reportDate: now,
                  note: "Order automatically completed after 7 days without customer feedback",
                  imageUrls: []
                }
              }
            }
          })

          // Update all order details to COMPLETED
          await this.prisma.orderDetail.updateMany({
            where: { orderId: order.id },
            data: {
              status: OrderDetailStatus.COMPLETED
            }
          })
        }
      }
    } catch (error) {
      this.logger.error("Error in checkShippedOrdersForCompletion:", error)
    }
  }

  public async checkFactoryLegitimacyPoints(): Promise<void> {
    try {
      // Get system configuration
      const systemConfig = await this.prisma.systemConfigOrder.findFirst({
        where: {
          type: "SYSTEM_CONFIG_ORDER"
        }
      })

      if (!systemConfig) {
        return
      }

      // Find factories with legitPoint below threshold
      const factoriesToSuspend = await this.prisma.factory.findMany({
        where: {
          legitPoint: {
            lte: systemConfig.legitPointToSuspend
          },
          factoryStatus: {
            not: FactoryStatus.SUSPENDED
          }
        }
      })

      // Suspend factories
      for (const factory of factoriesToSuspend) {
        await this.factoryService.changeFactoryStatus(
          { 
            status: FactoryStatus.SUSPENDED,
            staffId: factory.staffId,
            factoryOwnerId: factory.factoryOwnerId
          },
          { id: factory.factoryOwnerId } as UserEntity
        )
      }
    } catch (error) {
      this.logger.error("Error in checkFactoryLegitimacyPoints:", error)
    }
  }
}