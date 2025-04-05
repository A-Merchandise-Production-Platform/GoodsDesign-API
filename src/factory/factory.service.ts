import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException
} from "@nestjs/common"
import {
    Factory,
    FactoryOrderStatus,
    FactoryStatus,
    OrderDetailStatus,
    OrderStatus,
    QualityCheckStatus,
    Roles
} from "@prisma/client"
import { CustomerOrderEntity } from "src/customer-orders/entities"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { NotificationsService } from "src/notifications/notifications.service"
import { UserEntity } from "src/users/entities/users.entity"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateFactoryInfoDto } from "./dto/update-factory-info.dto"
import { AddressesService } from "src/addresses/addresses.service"
import { AddressEntity } from "src/addresses/entities/address.entity"
import { FactoryProductEntity } from "src/factory-products/entities/factory-product.entity"
import { FactoryProductsService } from "src/factory-products/factory-products.service"
import { UpdateFactoryStatusDto } from "src/factory/dto/update-factory-status"

@Injectable()
export class FactoryService {
    private logger = new Logger(FactoryService.name)

    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private addressesService: AddressesService,
        private factoryProductsService: FactoryProductsService
    ) {}

    public async checkPaymentReceivedOrderForAssignIntoFactory(): Promise<void> {
        try {
            this.logger.verbose("Running cron job: checkPaymentReceivedOrderForAssignIntoFactory")

            // Find orders with PAYMENT_RECEIVED status that don't already have factory orders
            const orders = await this.prisma.customerOrder.findMany({
                where: {
                    status: OrderStatus.PAYMENT_RECEIVED,
                    factoryOrder: {
                        none: {} // Ensure no factory orders exist for this customer order
                    }
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
                    }
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
                await this.processOrderForFactoryAssignment(order)
            }

            this.logger.verbose("Completed cron job: checkPaymentReceivedOrderForAssignIntoFactory")
        } catch (error) {
            this.logger.error(`Error in factory assignment cron job: ${error.message}`)
            throw error
        }
    }

    async updateFactoryInfo(userId: string, dto: UpdateFactoryInfoDto) {
        // First, check if the user is a factory owner
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { ownedFactory: true }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        if (user.role !== Roles.FACTORYOWNER) {
            throw new ForbiddenException("Only factory owners can update factory information")
        }

        if (userId !== user.ownedFactory.factoryOwnerId) {
            throw new ForbiddenException("You are not allowed to update this factory")
        }

        // Check if the factory already exists for this user
        const existingFactory = user.ownedFactory

        // Check if the factory is in a state that allows updates
        if (existingFactory && existingFactory.factoryStatus === "SUSPENDED") {
            throw new BadRequestException(
                "Factory information cannot be updated while in PENDING_APPROVAL or SUSPENDED status"
            )
        }

        // Check if the factory is already submitted for approval
        if (existingFactory && existingFactory.isSubmitted) {
            throw new BadRequestException(
                "Factory information has already been submitted for approval and cannot be updated"
            )
        }

        // Set isSubmitted to true if submit flag is provided
        const isSubmitted = true

        let address: AddressEntity

        if (existingFactory.addressId) {
            address = await this.addressesService.updateAddress(
                existingFactory.addressId,
                dto.addressInput,
                new UserEntity({ ...user, ownedFactory: null })
            )
        } else {
            address = await this.addressesService.createAddress(
                dto.addressInput,
                new UserEntity({ ...user, ownedFactory: null })
            )
        }

        // Update or create factory information
        const updatedFactory = await this.prisma.factory.upsert({
            where: {
                factoryOwnerId: userId
            },
            update: {
                name: dto.name,
                description: dto.description,
                businessLicenseUrl: dto.businessLicenseUrl,
                taxIdentificationNumber: dto.taxIdentificationNumber,
                addressId: address.id,
                website: dto.website,
                establishedDate: dto.establishedDate,
                totalEmployees: dto.totalEmployees,
                maxPrintingCapacity: dto.maxPrintingCapacity,
                qualityCertifications: dto.qualityCertifications,
                printingMethods: dto.printingMethods,
                specializations: dto.specializations,
                contactPersonName: dto.contactPersonName,
                contactPersonRole: dto.contactPersonRole,
                contactPhone: dto.contactPersonPhone,
                operationalHours: dto.operationalHours,
                leadTime: dto.leadTime,
                minimumOrderQuantity: dto.minimumOrderQuantity,
                isSubmitted: isSubmitted,
                factoryStatus: "PENDING_APPROVAL"
            },
            create: {
                factoryOwnerId: userId,
                name: dto.name || "New Factory",
                description: dto.description,
                businessLicenseUrl: dto.businessLicenseUrl,
                taxIdentificationNumber: dto.taxIdentificationNumber,
                addressId: address.id,
                website: dto.website,
                establishedDate: dto.establishedDate || new Date(),
                totalEmployees: dto.totalEmployees || 0,
                maxPrintingCapacity: dto.maxPrintingCapacity || 0,
                qualityCertifications: dto.qualityCertifications,
                printingMethods: dto.printingMethods || [],
                specializations: dto.specializations || [],
                contactPersonName: dto.contactPersonName,
                contactPersonRole: dto.contactPersonRole,
                contactPhone: dto.contactPersonPhone,
                operationalHours: dto.operationalHours || "9AM-5PM",
                leadTime: dto.leadTime,
                minimumOrderQuantity: dto.minimumOrderQuantity || 0,
                isSubmitted: isSubmitted,
                factoryStatus: "PENDING_APPROVAL"
            },
            include: {
                address: true,
                products: true,
                orders: true,
                staff: true,
                owner: true
            }
        })

        // Handle system config variants if provided
        if (dto.systemConfigVariantIds && dto.systemConfigVariantIds.length > 0) {
            // Get existing factory products
            const existingProducts = await this.prisma.factoryProduct.findMany({
                where: {
                    factoryId: userId
                }
            })

            // Create new factory products for new variants
            for (const variantId of dto.systemConfigVariantIds) {
                if (!existingProducts.some((p) => p.systemConfigVariantId === variantId)) {
                    await this.factoryProductsService.create({
                        factoryId: userId,
                        systemConfigVariantId: variantId,
                        productionCapacity: updatedFactory.maxPrintingCapacity,
                        estimatedProductionTime: updatedFactory.leadTime || 1
                    })
                }
            }

            // Remove factory products for variants that are no longer selected
            const variantsToRemove = existingProducts.filter(
                (p) => !dto.systemConfigVariantIds.includes(p.systemConfigVariantId)
            )

            for (const product of variantsToRemove) {
                await this.factoryProductsService.delete(
                    product.factoryId,
                    product.systemConfigVariantId
                )
            }
        }

        await this.notificationsService.create({
            title: "Factory Information Updated",
            content:
                "Your factory information has been updated and is pending approval, please wait for approval",
            userId: userId
        })

        return new FactoryEntity({
            ...updatedFactory,
            address: updatedFactory?.address
                ? new AddressEntity({
                      ...updatedFactory.address,
                      id: updatedFactory.address.id
                  })
                : null,
            products: updatedFactory.products
                ? updatedFactory.products.map(
                      (product) =>
                          new FactoryProductEntity({
                              ...product,
                              factoryId: updatedFactory.factoryOwnerId,
                              systemConfigVariantId: product.systemConfigVariantId
                          })
                  )
                : [],
            owner: new UserEntity({
                ...updatedFactory.owner,
                id: updatedFactory.owner.id
            }),
            staff: updatedFactory.staff
                ? new UserEntity({
                      ...updatedFactory.staff,
                      id: updatedFactory.staff.id
                  })
                : null
        })
    }

    async getMyFactory(userId: string) {
        if (!userId) {
            throw new BadRequestException("User ID is required")
        }

        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: userId },
            include: {
                address: true,
                products: true,
                orders: true,
                owner: true,
                staff: true
            }
        })

        if (!factory) return null

        return new FactoryEntity({
            ...factory,
            address: factory?.address
                ? new AddressEntity({
                      ...factory.address,
                      id: factory?.address?.id
                  })
                : null,
            products: factory?.products
                ? factory.products.map(
                      (product) =>
                          new FactoryProductEntity({
                              ...product,
                              factoryId: factory.factoryOwnerId,
                              systemConfigVariantId: product.systemConfigVariantId
                          })
                  )
                : [],
            owner: new UserEntity({
                ...factory.owner,
                id: factory.owner.id
            }),
            staff: factory?.staff
                ? new UserEntity({
                      ...factory.staff,
                      id: factory.staff.id
                  })
                : null
        })
    }

    private getMessageForFactoryStatusChange(status: FactoryStatus) {
        switch (status) {
            case FactoryStatus.APPROVED:
                return "Your factory has been approved and is now active"
            case FactoryStatus.SUSPENDED:
                return "Your factory has been suspended and is no longer active"
            case FactoryStatus.REJECTED:
                return "Your factory has been rejected by system"
        }
    }

    async changeFactoryStatus(dto: UpdateFactoryStatusDto, user: UserEntity) {
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to change factory status")
        }

        const factory = await this.prisma.factory.update({
            where: { factoryOwnerId: dto.factoryOwnerId },
            data: { factoryStatus: dto.status }
        })

        await this.notificationsService.create({
            title: "Factory Status Changed",
            content: this.getMessageForFactoryStatusChange(dto.status),
            userId: dto.factoryOwnerId
        })

        return new FactoryEntity(factory)
    }

    async assignStaffToFactory(factoryId: string, staffId: string, user: UserEntity) {
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to assign staff to factory")
        }

        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: factoryId },
            include: { owner: true, staff: true }
        })

        if (!factory) {
            throw new NotFoundException("Factory not found")
        }

        const staff = await this.prisma.user.findUnique({
            where: { id: staffId, role: Roles.STAFF },
            include: { staffedFactory: true }
        })

        if (!staff) {
            throw new NotFoundException("Staff not found")
        }

        if (staff.staffedFactory) {
            throw new BadRequestException("Staff already assigned to a factory")
        }

        await this.prisma.factory.update({
            where: { factoryOwnerId: factoryId },
            data: {
                staffId: staffId
            }
        })

        return new FactoryEntity({
            ...factory,
            owner: new UserEntity({
                ...factory.owner,
                id: factory.owner.id
            }),
            staff: new UserEntity(factory.staff)
        })
    }

    /**
     * Calculate a score for a factory based on its capacity, workload, and ability to handle variants
     * @param factory The factory to score
     * @param variantIds Array of variant IDs that need to be produced
     * @returns Score between 0-1, higher is better
     */
    async calculateFactoryScore(
        factory: Factory & { products: any[] },
        variantIds: string[]
    ): Promise<number> {
        try {
            // Check current workload (active orders)
            const activeOrders = await this.prisma.factoryOrder.count({
                where: {
                    factoryId: factory.factoryOwnerId,
                    status: {
                        in: [
                            FactoryOrderStatus.PENDING_ACCEPTANCE,
                            FactoryOrderStatus.ACCEPTED,
                            FactoryOrderStatus.IN_PRODUCTION
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
                return 0
            }

            // Calculate lead time score (shorter is better)
            const leadTimeScore = factory.leadTime ? 1 / factory.leadTime : 0

            // Calculate specialization score (if factory specializes in these products)
            const specializationScore = this.calculateSpecializationScore(factory, variantIds)

            // Calculate final score (weighted combination)
            const finalScore = capacityScore * 0.5 + leadTimeScore * 0.3 + specializationScore * 0.2

            return finalScore
        } catch (error) {
            this.logger.error(`Error calculating factory score: ${error.message}`)
            return 0
        }
    }

    /**
     * Calculate how specialized a factory is for specific variants
     * @param factory The factory to evaluate
     * @param variantIds Variant IDs needed for production
     * @returns Specialization score between 0-1
     */
    private calculateSpecializationScore(
        factory: Factory & { products: any[] },
        variantIds: string[]
    ): number {
        try {
            // Calculate average production time as a measure of specialization
            // Lower time means more specialized/efficient
            const relevantProducts = factory.products.filter((p) =>
                variantIds.includes(p.systemConfigVariantId)
            )

            if (relevantProducts.length === 0) return 0

            const avgProductionTime =
                relevantProducts.reduce(
                    (sum, product) => sum + product.estimatedProductionTime,
                    0
                ) / relevantProducts.length

            // Convert to a score where lower time means higher score
            // Assuming 60 is a reasonable max production time
            const MAX_PRODUCTION_TIME = 60
            return Math.max(0, 1 - avgProductionTime / MAX_PRODUCTION_TIME)
        } catch (error) {
            this.logger.error(`Error calculating specialization score: ${error.message}`)
            return 0
        }
    }

    /**
     * Find best factory for producing a given set of variants
     * @param variantIds Array of variant IDs that need to be produced
     * @returns The best factory or null if none found
     */
    async findBestFactoryForVariants(variantIds: string[]): Promise<FactoryEntity | null> {
        try {
            // Find eligible factories that can produce all variants
            const factories = await this.prisma.factory.findMany({
                where: {
                    factoryStatus: "APPROVED",
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

            // Score each factory
            const factoryScores = await Promise.all(
                factories.map(async (factory) => {
                    const score = await this.calculateFactoryScore(factory, variantIds)
                    return { factory, score }
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

    /**
     * Find and rank all eligible factories for a set of variants
     * @param variantIds Array of variant IDs that need to be produced
     * @param excludedFactoryIds Array of factory IDs to exclude (e.g., those that have rejected the order)
     * @returns Array of factories with their scores, sorted by score (highest first)
     */
    async findAndRankFactoriesForVariants(
        variantIds: string[],
        excludedFactoryIds: string[] = []
    ): Promise<Array<{ factory: Factory & { owner: any; products: any[] }; score: number }>> {
        try {
            // Find eligible factories that can produce all variants
            const factories = await this.prisma.factory.findMany({
                where: {
                    factoryOwnerId: { notIn: excludedFactoryIds },
                    factoryStatus: "APPROVED",
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
                return []
            }

            // Score each factory
            const factoryScores = await Promise.all(
                factories.map(async (factory) => {
                    const score = await this.calculateFactoryScore(factory, variantIds)
                    return { factory, score }
                })
            )

            // Sort by score (highest first) and filter out factories with zero score
            return factoryScores.filter((f) => f.score > 0).sort((a, b) => b.score - a.score)
        } catch (error) {
            this.logger.error(`Error finding and ranking factories: ${error.message}`)
            return []
        }
    }

    /**
     * Reassign a rejected factory order to a new factory
     * @param factoryOrderId ID of the rejected factory order
     * @returns The newly created factory order or null if reassignment failed
     */
    async reassignRejectedFactoryOrder(factoryOrderId: string): Promise<any> {
        try {
            // Find the rejected factory order
            const rejectedOrder = await this.prisma.factoryOrder.findUnique({
                where: { id: factoryOrderId },
                include: {
                    rejectedHistory: true,
                    orderDetails: {
                        include: {
                            design: {
                                include: {
                                    systemConfigVariant: true
                                }
                            }
                        }
                    }
                }
            })

            if (!rejectedOrder) {
                this.logger.warn(`Factory order ${factoryOrderId} not found`)
                return null
            }

            // Get all factories that have rejected this order
            const rejectedFactoryIds = rejectedOrder.rejectedHistory.map(
                (history) => history.factoryId
            )

            // Get variant IDs from the order details
            const variantIds = rejectedOrder.orderDetails.map(
                (detail) => detail.design.systemConfigVariantId
            )
            const uniqueVariantIds = [...new Set(variantIds)]

            // Find and rank all eligible factories
            const rankedFactories = await this.findAndRankFactoriesForVariants(
                uniqueVariantIds,
                rejectedFactoryIds
            )

            if (rankedFactories.length === 0) {
                this.logger.warn(`No suitable factories found for order ${factoryOrderId}`)
                return null
            }

            // Select the highest ranked factory
            const selectedFactory = rankedFactories[0].factory

            // Calculate total items and production costs
            const totalItems = rejectedOrder.orderDetails.reduce(
                (sum, detail) => sum + detail.quantity,
                0
            )
            let totalProductionCost = 0

            // Calculate production costs for each order detail
            const orderDetailsWithCost = await Promise.all(
                rejectedOrder.orderDetails.map(async (detail) => {
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
                    const baseCostPerUnit = factoryProduct.estimatedProductionTime * 10000
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

            // Create new factory order
            const newFactoryOrder = await this.prisma.factoryOrder.create({
                data: {
                    factoryId: selectedFactory.owner.id,
                    customerOrderId: rejectedOrder.customerOrderId,
                    status: "PENDING_ACCEPTANCE",
                    assignedAt: new Date(),
                    acceptanceDeadline,
                    totalItems,
                    totalProductionCost,
                    orderDetails: {
                        create: orderDetailsWithCost.map((detail) => ({
                            designId: detail.designId,
                            orderDetailId: detail.orderDetailId,
                            quantity: detail.quantity,
                            price: detail.price,
                            productionCost: detail.productionCost,
                            qualityStatus: QualityCheckStatus.PENDING,
                            status: OrderDetailStatus.PENDING
                        }))
                    }
                }
            })

            // Update the rejected history with reassignment information
            await this.prisma.rejectedFactoryOrder.updateMany({
                where: {
                    factoryOrderId: factoryOrderId,
                    reassignedTo: null
                },
                data: {
                    reassignedTo: selectedFactory.owner.id,
                    reassignedAt: new Date()
                }
            })

            // Create notification for the new factory
            await this.prisma.notification.create({
                data: {
                    userId: selectedFactory.owner.id,
                    title: "New Order Assignment",
                    content: `You have been assigned a new order #${rejectedOrder.customerOrderId} with ${totalItems} items.`,
                    url: `/factory/orders/${newFactoryOrder.id}`
                }
            })

            this.logger.log(
                `Successfully reassigned factory order ${factoryOrderId} to factory ${selectedFactory.owner.id} (rank: ${rankedFactories[0].score.toFixed(2)})`
            )

            return newFactoryOrder
        } catch (error) {
            this.logger.error(`Failed to reassign factory order ${factoryOrderId}:`, error)
            return null
        }
    }

    /**
     * Process a single order for factory assignment
     * @param order The customer order to process
     */
    public async processOrderForFactoryAssignment(order: CustomerOrderEntity): Promise<void> {
        try {
            // Extract all variant IDs from this order
            const variantIds = order.orderDetails.map(
                (detail) => detail.design.systemConfigVariantId
            )
            const uniqueVariantIds = [...new Set(variantIds)]

            // Calculate total items
            const totalItems = order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)

            this.logger.verbose(
                `Processing order ${order.id} with ${totalItems} items across ${uniqueVariantIds.length} variants`
            )

            // Find the best factory for this order
            const selectedFactory = await this.findBestFactoryForVariants(uniqueVariantIds)

            if (!selectedFactory) {
                this.logger.warn(
                    `No suitable factory found for order ${order.id}. Manual assignment required.`
                )
                return
            }

            // Calculate production costs for each order detail
            let totalProductionCost = 0
            const orderDetailsWithCost = await Promise.all(
                order.orderDetails.map(async (detail) => {
                    // Find the factory product for this variant
                    const factoryProduct = selectedFactory.products.find(
                        (p) => p.systemConfigVariantId == detail.design.systemConfigVariantId
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
                    const baseCostPerUnit = factoryProduct.estimatedProductionTime * 10000 // Cost calculation based on time
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

            // Use transaction to ensure atomicity
            await this.prisma.$transaction(async (tx) => {
                // Create factory order for this customer order
                const factoryOrder = await tx.factoryOrder.create({
                    data: {
                        factoryId: selectedFactory.owner.id,
                        customerOrderId: order.id,
                        status: FactoryOrderStatus.PENDING_ACCEPTANCE,
                        assignedAt: new Date(),
                        acceptanceDeadline,
                        totalItems,
                        totalProductionCost,
                        orderDetails: {
                            create: orderDetailsWithCost.map((detail) => ({
                                designId: detail.designId,
                                orderDetailId: detail.id,
                                quantity: detail.quantity,
                                price: detail.price,
                                status: OrderStatus.PENDING,
                                productionCost: detail.productionCost
                            }))
                        }
                    }
                })

                // Update customer order status
                await tx.customerOrder.update({
                    where: { id: order.id },
                    data: {
                        status: OrderStatus.ASSIGNED_TO_FACTORY,
                        history: {
                            create: {
                                status: OrderStatus.ASSIGNED_TO_FACTORY,
                                timestamp: new Date(),
                                note: `Order assigned to factory: ${selectedFactory.name}`
                            }
                        }
                    }
                })

                // Create notification for factory owner
                await tx.notification.create({
                    data: {
                        userId: selectedFactory.owner.id,
                        title: "New Order Assignment",
                        content: `You have been assigned a new order #${order.id} with ${totalItems} items.`,
                        url: `/factory/orders/${factoryOrder.id}`
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
}
