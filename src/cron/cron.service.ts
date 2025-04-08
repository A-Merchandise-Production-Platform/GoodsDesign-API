import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FactoryStatus, OrderStatus, TaskStatus, TaskType } from '@prisma/client';
import { FactoryProductEntity } from 'src/factory-products/entities/factory-product.entity';
import { FactoryEntity } from 'src/factory/entities/factory.entity';
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

  public async checkPaymentReceivedOrderForAssignIntoFactory(): Promise<void> {
    try {
        this.logger.verbose("Running cron job: checkPaymentReceivedOrderForAssignIntoFactory")

        // Get system configuration
        const systemConfig = await this.prisma.systemConfigOrder.findFirst({
            where: {
                type: "SYSTEM_CONFIG_ORDER"
            }
        })

        if (!systemConfig) {
            this.logger.error("System configuration not found")
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

        this.logger.verbose(
            `Found ${orders.length} orders with PAYMENT_RECEIVED status to assign to factories`
        )

        if (orders.length === 0) {
            return
        }

        // Process each order individually
        for (const order of orders) {
            // Check if order has been rejected too many times
            if (order.rejectedHistory.length >= systemConfig.limitFactoryRejectOrders) {
                this.logger.warn(
                    `Order ${order.id} has been rejected ${order.rejectedHistory.length} times. Moving to NEED_MANAGER_HANDLE status.`
                )
                
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

        this.logger.verbose("Completed cron job: checkPaymentReceivedOrderForAssignIntoFactory")
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

          this.logger.verbose(
              `Processing order ${order.id} with ${totalItems} items across ${uniqueVariantIds.length} variants`
          )

          // Find the best factory for this order, excluding previously rejecting factories
          const selectedFactory = await this.findBestFactoryForVariants(uniqueVariantIds, order.id)

          if (!selectedFactory) {
              this.logger.warn(
                  `No suitable factory found for order ${order.id}. Moving to NEED_MANAGER_HANDLE status.`
              )
              
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
              this.logger.error("System configuration not found")
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
                      this.logger.warn(
                          `Factory product not found for variant ${detail.design.systemConfigVariantId} in factory ${selectedFactory.name}`
                      )
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

          this.logger.log(
              `Successfully assigned order ${order.id} to factory ${selectedFactory.name}`
          )
      } catch (error) {
          this.logger.error(`Error processing order ${order.id}: ${error.message}`)
      }
  }

  private async findBestFactoryForVariants(variantIds: string[], orderId: string): Promise<FactoryEntity | null> {
      try {
          // Get previously rejecting factories for this order
          const rejectedFactories = await this.prisma.rejectedOrder.findMany({
              where: { orderId },
              select: { factoryId: true }
          })
          const rejectedFactoryIds = rejectedFactories.map(rf => rf.factoryId)

          // Find eligible factories that can produce all variants and haven't rejected this order
          const factories = await this.prisma.factory.findMany({
              where: {
                  factoryStatus: FactoryStatus.APPROVED,
                  factoryOwnerId: {
                      notIn: rejectedFactoryIds
                  },
                  products: {
                      some: {
                          systemConfigVariantId: {
                              in: variantIds
                          }
                      }
                  }
              },
              include: {
                  owner: true,
                  products: {
                      where: {
                          systemConfigVariantId: {
                              in: variantIds
                          }
                      }
                  }
              }
          })

          if (factories.length === 0) {
              return null
          }

          // Get system configuration for legitimacy points threshold
          const systemConfig = await this.prisma.systemConfigOrder.findFirst({
              where: { type: "SYSTEM_CONFIG_ORDER" }
          })

          if (!systemConfig) {
              this.logger.error("System configuration not found")
              return null
          }

          // Score each factory based on various factors
          const factoryScores = await Promise.all(
              factories.map(async (factory) => {
                  // Check current workload (active orders)
                  const activeOrders = await this.prisma.order.count({
                      where: {
                          factoryId: factory.factoryOwnerId,
                          status: {
                              in: [
                                  OrderStatus.PENDING_ACCEPTANCE,
                                  OrderStatus.IN_PRODUCTION
                              ]
                          }
                      }
                  })

                  // Calculate capacity availability (as a percentage)
                  const totalCapacity = factory.maxPrintingCapacity
                  const capacityScore = Math.max(0, (totalCapacity - activeOrders * 50) / totalCapacity)

                  // Check if factory can handle all variants
                  const canHandleAllVariants = variantIds.every((variantId) =>
                      factory.products.some((p) => p.systemConfigVariantId === variantId)
                  )

                  if (!canHandleAllVariants) {
                      return { factory, score: 0 }
                  }

                  // Calculate lead time score (shorter is better)
                  const leadTimeScore = factory.leadTime ? 1 / factory.leadTime : 0

                  // Calculate specialization score (if factory specializes in these products)
                  const specializationScore = this.calculateSpecializationScore(factory, variantIds, systemConfig)

                  // Calculate legitimacy points score
                  // Normalize the score between 0 and 1, where higher legitPoint means higher score
                  const maxLegitPoint = (systemConfig as any).maxLegitPoint || 100
                  const legitPointScore = Math.min(1, factory.legitPoint / maxLegitPoint)

                  // Calculate operational hours score
                  // Higher operational hours means more availability
                  const operationalHoursScore = this.calculateOperationalHoursScore(factory.operationalHours)

                  // Calculate production capacity score based on factory products
                  const productionCapacityScore = this.calculateProductionCapacityScore(factory, variantIds, systemConfig)

                  // Calculate final score (weighted combination)
                  // Using weights from system configuration with fallbacks
                  const finalScore = 
                      capacityScore * (systemConfig?.capacityScoreWeight || 0.2) + 
                      leadTimeScore * (systemConfig?.leadTimeScoreWeight || 0.15) + 
                      specializationScore * (systemConfig?.specializationScoreWeight || 0.15) + 
                      legitPointScore * (systemConfig?.legitPointScoreWeight || 0.25) + 
                      operationalHoursScore * (systemConfig?.operationalHoursScoreWeight || 0.15) + 
                      productionCapacityScore * (systemConfig?.productionCapacityScoreWeight || 0.1)

                  return { factory, score: finalScore }
              })
          )

          // Sort by score (highest first)
          factoryScores.sort((a, b) => b.score - a.score)

          // Return the best factory or null if none have a positive score
          if (factoryScores[0]?.score > 0) {
              return new FactoryEntity({
                  ...factoryScores[0].factory,
                  products: factoryScores[0].factory.products.map(
                      (p) => new FactoryProductEntity(p)
                  ),
                  owner: new UserEntity(factoryScores[0].factory.owner)
              })
          }
          return null
      } catch (error) {
          this.logger.error(`Error finding best factory: ${error.message}`)
          return null
      }
  }

  private calculateSpecializationScore(factory: any, variantIds: string[], systemConfig: any): number {
      try {
          // Calculate average production time as a measure of specialization
          // Lower time means more specialized/efficient
          const relevantProducts = factory.products.filter((p) =>
              variantIds.includes(p.systemConfigVariantId)
          )

          if (relevantProducts.length === 0) return 0

          const avgProductionTime =
              relevantProducts.reduce(
                  (sum, product) => sum + product.productionTimeInMinutes,
                  0
              ) / relevantProducts.length

          // Convert to a score where lower time means higher score
          // Using maxProductionTimeInMinutes from system config with fallback
          const maxProductionTime = (systemConfig as any).maxProductionTimeInMinutes || 300
          return Math.max(0, 1 - avgProductionTime / maxProductionTime)
      } catch (error) {
          this.logger.error(`Error calculating specialization score: ${error.message}`)
          return 0
      }
  }

  private calculateOperationalHoursScore(operationalHours: string): number {
      try {
          // Parse operational hours (format: "HH:MM-HH:MM")
          const [startTime, endTime] = operationalHours.split('-')
          if (!startTime || !endTime) return 0.5 // Default score if format is invalid

          // Convert to hours
          const [startHour, startMinute] = startTime.split(':').map(Number)
          const [endHour, endMinute] = endTime.split(':').map(Number)

          // Calculate total operational hours
          let totalHours = endHour - startHour
          if (endMinute < startMinute) {
              totalHours -= 1
          }

          // Normalize score (higher hours = higher score)
          // Assuming 24 hours is the maximum
          return Math.min(1, totalHours / 24)
      } catch (error) {
          this.logger.error(`Error calculating operational hours score: ${error.message}`)
          return 0.5 // Default score on error
      }
  }

  private calculateProductionCapacityScore(factory: any, variantIds: string[], systemConfig: any): number {
      try {
          // Get relevant factory products
          const relevantProducts = factory.products.filter((p) =>
              variantIds.includes(p.systemConfigVariantId)
          )

          if (relevantProducts.length === 0) return 0

          // Calculate average production capacity
          const avgProductionCapacity = relevantProducts.reduce(
              (sum, product) => sum + product.productionCapacity,
              0
          ) / relevantProducts.length

          // Normalize score (higher capacity = higher score)
          // Using maxProductionCapacity from system config with fallback
          const maxProductionCapacity = (systemConfig as any).maxProductionCapacity || 1000
          return Math.min(1, avgProductionCapacity / maxProductionCapacity)
      } catch (error) {
          this.logger.error(`Error calculating production capacity score: ${error.message}`)
          return 0
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

  public async checkFactoryLegitimacyPoints(): Promise<void> {
    try {
      this.logger.verbose("Running cron job: checkFactoryLegitimacyPoints")

      // Get system configuration
      const systemConfig = await this.prisma.systemConfigOrder.findFirst({
        where: {
          type: "SYSTEM_CONFIG_ORDER"
        }
      })

      if (!systemConfig) {
        this.logger.error("System configuration not found")
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
        this.logger.log(`Factory ${factory.factoryOwnerId} suspended due to low legitimacy points (${factory.legitPoint})`)
      }

      if (factoriesToSuspend.length > 0) {
        this.logger.log(`Suspended ${factoriesToSuspend.length} factories due to low legitimacy points`)
      }
    } catch (error) {
      this.logger.error("Error in checkFactoryLegitimacyPoints:", error)
    }
  }
}