import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FactoryStatus, OrderStatus } from '@prisma/client';
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

          // Set acceptance deadline to 24 hours from now
          const acceptanceDeadline = new Date()
          acceptanceDeadline.setHours(acceptanceDeadline.getHours() + 24)

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
                  const specializationScore = this.calculateSpecializationScore(factory, variantIds)

                  // Calculate final score (weighted combination)
                  const finalScore = capacityScore * 0.5 + leadTimeScore * 0.3 + specializationScore * 0.2

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

  private calculateSpecializationScore(factory: any, variantIds: string[]): number {
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
          // Assuming 300 minutes (5 hours) is a reasonable max production time
          const MAX_PRODUCTION_TIME = 300
          return Math.max(0, 1 - avgProductionTime / MAX_PRODUCTION_TIME)
      } catch (error) {
          this.logger.error(`Error calculating specialization score: ${error.message}`)
          return 0
      }
  }
}