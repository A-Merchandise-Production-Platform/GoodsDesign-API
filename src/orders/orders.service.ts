import { BadRequestException, Injectable } from "@nestjs/common"
import {
    OrderDetailStatus,
    OrderStatus,
    QualityCheckStatus,
    TaskStatus,
    TaskType
} from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { CreateOrderInput } from "./dto/create-order.input"
import { OrderEntity } from "./entities/order.entity"
import { FeedbackOrderInput } from "./dto/feedback-order.input"
import { NotificationsService } from "src/notifications/notifications.service"
import { ShippingService } from "src/shipping/shipping.service"

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService,
      private readonly notificationsService: NotificationsService,
      private readonly shippingService: ShippingService
    ) {}

    async create(createOrderInput: CreateOrderInput, userId: string) {
        // Validate order items
        if (!createOrderInput.orderDetails.length) {
            throw new BadRequestException("Order must contain at least one item")
        }

        // Get system config for order
        const systemConfig = await this.prisma.systemConfigOrder.findUnique({
            where: { type: "SYSTEM_CONFIG_ORDER" }
        })

        if (!systemConfig) {
            throw new BadRequestException("System configuration not found")
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
            })

            // Validate that all requested cart items were found
            if (cartItems.length !== createOrderInput.orderDetails.length) {
                throw new BadRequestException("Some cart items were not found")
            }

            let totalOrderPrice = 0
            const orderDetailsToCreate = cartItems.map((cartItem) => {
                const design = cartItem.design

                // Calculate item price: variant price + sum of all position prices
                const blankPrice = design.systemConfigVariant.price || 0
                const positionPrices = design.designPositions.reduce((sum, position) => {
                    if (position.designJSON && Object.keys(position.designJSON).length > 0) {
                        return sum + position.positionType.basePrice
                    }
                    return sum
                }, 0)

                const baseItemPrice = blankPrice + positionPrices

                // Get applicable discount based on quantity
                const discounts = design.systemConfigVariant.product.discounts || []
                let maxDiscountPercent = 0

                for (const discount of discounts) {
                    if (
                        cartItem.quantity >= discount.minQuantity &&
                        discount.discountPercent > maxDiscountPercent
                    ) {
                        maxDiscountPercent = discount.discountPercent
                    }
                }

                const itemPrice = baseItemPrice * (1 - maxDiscountPercent)
                const detailTotalPrice = itemPrice * cartItem.quantity

                totalOrderPrice += detailTotalPrice

                return {
                    designId: design.id,
                    quantity: cartItem.quantity,
                    price: itemPrice,
                    status: OrderDetailStatus.PENDING,
                    completedQty: 0,
                    rejectedQty: 0,
                    reworkTime: 0,
                    isRework: false
                }
            })

            // Calculate estimated times based on system config
            const now = new Date()
            const estimatedCheckQualityAt = new Date(
                now.getTime() + systemConfig.checkQualityTimesDays * 24 * 60 * 60 * 1000
            )
            const estimatedDoneProductionAt = new Date(
                now.getTime() + systemConfig.shippingDays * 24 * 60 * 60 * 1000
            )
            const estimatedCompletionAt = new Date(
                now.getTime() + (systemConfig.shippingDays + 2) * 24 * 60 * 60 * 1000
            )

            // TODO: get address id from user
            const user = await tx.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    addresses: true
                }
            })

            //if address is not found, throw you should add address first
            if (!user.addresses.length) {
                throw new BadRequestException("You should add address first")
            }

            // Create the order
            const order = await tx.order.create({
                data: {
                    customerId: userId,
                    status: OrderStatus.PENDING,
                    totalPrice: totalOrderPrice,
                    // TODO: get address id from user
                    addressId: user.addresses[0]?.id,
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
            })

            // Create payment
            await tx.payment.create({
                data: {
                    orderId: order.id,
                    customerId: userId,
                    amount: totalOrderPrice,
                    type: "DEPOSIT",
                    paymentLog: "Initial deposit payment for order " + order.id,
                    createdAt: now,
                    status: "PENDING"
                }
            })

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
                })

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
                })
            }

            // Remove the ordered items from the cart
            await tx.cartItem.deleteMany({
                where: {
                    id: { in: createOrderInput.orderDetails.map((v) => v.cartItemId) },
                    userId: userId
                }
            })

            return order
        })
    }

    async findAll() {
        const orders = await this.prisma.order.findMany({
            orderBy: { orderDate: 'desc' },
            include: {
                address: true,
                customer: true,
                factory: {
                    include: {
                        owner: true,
                        staff: true,
                        address: true
                    }
                },
                orderDetails: {
                    include: {
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                }
                            }
                        },
                        design: {
                            include: {
                                systemConfigVariant: {
                                    include: {
                                        product: true
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
                },
                orderProgressReports: true,
                payments: {
                    include: {
                        transactions: true
                    }
                },
                rejectedHistory: {
                    include: {
                        factory: {
                            include: {
                                owner: true,
                                address: true
                            }
                        }
                    }
                }
            }
        })

        return orders.map((data) => new OrderEntity(data))
    }

    async findByCustomerId(customerId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                customerId
            },
            orderBy: { orderDate: 'desc' },
            include: {
                address: true,
                customer: true,
                factory: {
                    include: {
                        owner: true,
                        staff: true,
                        address: true
                    }
                },
                orderDetails: {
                    include: {
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                }
                            }
                        },
                        design: {
                            include: {
                                systemConfigVariant: {
                                    include: {
                                        product: true
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
                },
                orderProgressReports: true,
                payments: {
                    include: {
                        transactions: true
                    }
                },
                rejectedHistory: {
                    include: {
                        factory: {
                            include: {
                                owner: true,
                                address: true
                            }
                        }
                    }
                }
            }
        })
        return orders.map((order) => new OrderEntity(order))
    }

    async findByMyFactoryId(factoryId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                factoryId
            },
            orderBy: { orderDate: 'desc' },
            include: {
                address: true,
                customer: true,
                factory: {
                    include: {
                        owner: true,
                        staff: true,
                        address: true
                    }
                },
                orderDetails: {
                    include: {
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                }
                            }
                        },
                        design: {
                            include: {
                                systemConfigVariant: {
                                    include: {
                                        product: true
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
                },
                orderProgressReports: true,
                payments: {
                    include: {
                        transactions: true
                    }
                },
                rejectedHistory: {
                    include: {
                        factory: {
                            include: {
                                owner: true,
                                address: true
                            }
                        }
                    }
                }
            }
        })
        return orders.map((order) => new OrderEntity(order))
    }

    async findByStaffId(staffId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                tasks: {
                    some: {
                        userId: staffId
                    }
                }
            },
            orderBy: { orderDate: 'desc' },
            include: {
                address: true,
                customer: true,
                factory: {
                    include: {
                        owner: true,
                        staff: true,
                        address: true
                    }
                },
                orderDetails: {
                    include: {
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                }
                            }
                        },
                        design: {
                            include: {
                                systemConfigVariant: {
                                    include: {
                                        product: true
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
                },
                orderProgressReports: true,
                payments: {
                    include: {
                        transactions: true
                    }
                },
                rejectedHistory: {
                    include: {
                        factory: {
                            include: {
                                owner: true,
                                address: true
                            }
                        }
                    }
                },
                tasks: {
                    where: {
                        userId: staffId
                    },
                    include: {
                        assignee: true
                    }
                }
            }
        })
        return orders.map((order) => new OrderEntity(order))
    }

    async findOne(id: string) {
        const result = await this.prisma.order.findUnique({
            where: { id },
            include: {
                address: true,
                customer: true,
                factory: {
                    include: {
                        owner: true,
                        staff: true,
                        address: true
                    }
                },
                orderDetails: {
                    include: {
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                }
                            }
                        },
                        design: {
                            include: {
                                systemConfigVariant: {
                                    include: {
                                        product: true
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
                },
                orderProgressReports: true,
                payments: {
                    include: {
                        transactions: true
                    }
                },
                rejectedHistory: {
                    include: {
                        factory: {
                            include: {
                                owner: true,
                                address: true
                            }
                        }
                    }
                }
            }
        })

        return new OrderEntity(result)
    }

    async acceptOrderForFactory(orderId: string, factoryId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order with its details
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    orderDetails: true,
                    factory: true,
                    customer: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.factoryId !== factoryId) {
                throw new BadRequestException("This order is not assigned to your factory")
            }

            if (order.status !== OrderStatus.PENDING_ACCEPTANCE) {
                throw new BadRequestException("This order is not in PENDING_ACCEPTANCE status")
            }

            // Update order status and dates
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.IN_PRODUCTION,
                    acceptedAt: now,
                    currentProgress: 20,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: `Order accepted by factory ${factoryId} and production started`,
                            imageUrls: []
                        }
                    }
                },
                include: {
                    orderDetails: true,
                    customer: true
                }
            })

            // update task staff id to factory staff id
            await tx.task.updateMany({
                where: {
                    orderId: orderId,
                },
                data: { 
                    userId: order.factory.staffId,
                }
            })

            // Update all order details status
            await tx.orderDetail.updateMany({
                where: {
                    orderId: orderId
                },
                data: {
                    status: OrderDetailStatus.IN_PRODUCTION
                }
            })

            // Notify customer about order acceptance
            await this.notificationsService.create({
                title: "Order Accepted",
                content: `Your order #${orderId} has been accepted by the factory and production has started.`,
                userId: order.customer.id,
                url: `/orders/${orderId}`
            })

            // Notify factory staff about new task
            await this.notificationsService.create({
                title: "New Production Task",
                content: `You have been assigned to handle the production of order #${orderId}.`,
                userId: order.factory.staffId,
                url: `/factory/orders/${orderId}`
            })

            return updatedOrder
        })
    }

    async rejectOrder(orderId: string, factoryId: string, reason: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order with its details
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    orderDetails: true,
                    customer: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.factoryId !== factoryId) {
                throw new BadRequestException("This order is not assigned to your factory")
            }

            if (order.status !== OrderStatus.PENDING_ACCEPTANCE) {
                throw new BadRequestException("This order is not in PENDING_ACCEPTANCE status")
            }

            // Get system config for order
            const systemConfig = await tx.systemConfigOrder.findUnique({
                where: { type: "SYSTEM_CONFIG_ORDER" }
            })

            if (!systemConfig) {
                throw new BadRequestException("System configuration not found")
            }

            // Create rejected order record
            await tx.rejectedOrder.create({
                data: {
                    orderId,
                    factoryId,
                    reason,
                    rejectedAt: now
                }
            })

            // Update factory legit points
            await tx.factory.update({
                where: { factoryOwnerId: factoryId },
                data: {
                    legitPoint: {
                        decrement: systemConfig.reduceLegitPointIfReject
                    }
                }
            })

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
                    orderDetails: true,
                    customer: true
                }
            })

            // Notify customer about order rejection
            await this.notificationsService.create({
                title: "Order Rejected",
                content: `Your order #${orderId} has been rejected by the factory. Reason: ${reason}`,
                userId: order.customer.id,
                url: `/orders/${orderId}`
            })

            // Notify factory owner about legitimacy point deduction
            await this.notificationsService.create({
                title: "Legitimacy Points Deducted",
                content: `Your factory has lost ${systemConfig.reduceLegitPointIfReject} legitimacy points due to order rejection.`,
                userId: factoryId,
                url: `/factory/orders/${orderId}`
            })

            return updatedOrder
        })
    }

    async doneProductionOrderDetails(orderDetailId: string, factoryId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order detail with its order
            const orderDetail = await tx.orderDetail.findUnique({
                where: { id: orderDetailId },
                include: {
                    order: {
                        include: {
                            orderDetails: true,
                            tasks: true,
                            customer: true
                        }
                    }
                }
            })

            if (!orderDetail) {
                throw new BadRequestException("Order detail not found")
            }

            if (orderDetail.order.factoryId !== factoryId) {
                throw new BadRequestException("This order is not assigned to your factory")
            }

            if (orderDetail.status !== OrderDetailStatus.IN_PRODUCTION) {
                throw new BadRequestException("This order detail is not in IN_PRODUCTION status")
            }

            // Update order detail status to DONE_PRODUCTION
            await tx.orderDetail.update({
                where: { id: orderDetailId },
                data: {
                    status: OrderDetailStatus.DONE_PRODUCTION,
                    completedQty: orderDetail.quantity,
                    updatedAt: now
                }
            })

            // Create progress report
            await tx.orderProgressReport.create({
                data: {
                    orderId: orderDetail.order.id,
                    reportDate: now,
                    note: `Order detail ${orderDetailId} production completed`,
                    imageUrls: []
                }
            })

            // Check if all order details are done
            const allDetailsDone = orderDetail.order.orderDetails.every(
                (detail) =>
                    detail.status === OrderDetailStatus.DONE_PRODUCTION ||
                    detail.id === orderDetailId // Include the current detail as it's being updated
            )

            if (allDetailsDone) {
                // Update all order details to WAITING_FOR_CHECKING_QUALITY
                await tx.orderDetail.updateMany({
                    where: {
                        orderId: orderDetail.order.id
                    },
                    data: {
                        status: OrderDetailStatus.WAITING_FOR_CHECKING_QUALITY
                    }
                })

                // Update order status to WAITING_FOR_CHECKING_QUALITY
                await tx.order.update({
                    where: { id: orderDetail.order.id },
                    data: {
                        status: OrderStatus.WAITING_FOR_CHECKING_QUALITY,
                        doneProductionAt: now,
                        currentProgress: 50,
                        orderProgressReports: {
                            create: {
                                reportDate: now,
                                note: "All order details production completed. Moving to quality check phase.",
                                imageUrls: []
                            }
                        }
                    }
                })

                // Update all quality check tasks to IN_PROGRESS
                const qualityCheckTasks = orderDetail.order.tasks.filter(
                    (task) => task.taskType === TaskType.QUALITY_CHECK
                )

                for (const task of qualityCheckTasks) {
                    await tx.task.update({
                        where: { id: task.id },
                        data: {
                            status: TaskStatus.IN_PROGRESS
                        }
                    })

                    // Notify staff about quality check task
                    await this.notificationsService.create({
                        title: "Quality Check Required",
                        content: `Please perform quality check for order #${orderDetail.order.id}`,
                        userId: task.userId,
                        url: `/quality-checks/${task.id}`
                    })
                }

                // Notify customer about production completion
                await this.notificationsService.create({
                    title: "Production Completed",
                    content: `Production for your order #${orderDetail.order.id} has been completed. Quality check is in progress.`,
                    userId: orderDetail.order.customer.id,
                    url: `/orders/${orderDetail.order.id}`
                })
            }

            return orderDetail
        })
    }

    async doneCheckQuality(
        checkQualityId: string,
        staffId: string,
        passedQuantity: number,
        failedQuantity: number,
        note?: string,
        imageUrls?: string[]
    ) {
        return this.prisma.$transaction(async (tx) => {
            const now = new Date()

            // Get the check quality with its task and order detail
            const checkQuality = await tx.checkQuality.findUnique({
                where: { id: checkQualityId },
                include: {
                    task: true,
                    orderDetail: {
                        include: {
                            checkQualities: true,
                            order: {
                                include: {
                                    orderDetails: {
                                        include: {
                                            checkQualities: true
                                        }
                                    },
                                    tasks: true,
                                    customer: true
                                }
                            }
                        }
                    }
                }
            })

            if (!checkQuality) {
                throw new BadRequestException("Check quality record not found")
            }

            if (checkQuality.task.userId !== staffId) {
                throw new BadRequestException("This task is not assigned to you")
            }

            if (checkQuality.status !== QualityCheckStatus.PENDING) {
                throw new BadRequestException("This quality check is not in PENDING status")
            }

            // Validate quantities
            if (passedQuantity + failedQuantity > checkQuality.orderDetail.quantity) {
                throw new BadRequestException("Total checked quantity exceeds order detail quantity")
            }

            // Update check quality
            const updatedCheckQuality = await tx.checkQuality.update({
                where: { id: checkQualityId },
                data: {
                    totalChecked: passedQuantity + failedQuantity,
                    passedQuantity,
                    failedQuantity,
                    status:
                        failedQuantity > 0 ? QualityCheckStatus.REJECTED : QualityCheckStatus.APPROVED,
                    note,
                    imageUrls: imageUrls || [],
                    checkedAt: now,
                    checkedBy: staffId
                }
            })

            // Update task status to COMPLETED
            await tx.task.update({
                where: { id: checkQuality.taskId },
                data: {
                    status: TaskStatus.COMPLETED,
                    completedDate: now
                }
            })

            // Create progress report
            await tx.orderProgressReport.create({
                data: {
                    orderId: checkQuality.orderDetail.order.id,
                    reportDate: now,
                    note: `Quality check completed for order detail ${checkQuality.orderDetailId}. Passed: ${passedQuantity}, Failed: ${failedQuantity}`,
                    imageUrls: imageUrls || []
                }
            })

            // Update current order detail status based on check result
            await tx.orderDetail.update({
                where: { id: checkQuality.orderDetailId },
                data: {
                    status:
                        failedQuantity > 0
                            ? OrderDetailStatus.REWORK_REQUIRED
                            : OrderDetailStatus.DONE_CHECK_QUALITY
                }
            })

            console.log("checkQuality", checkQuality.orderDetail.order.orderDetails)

            // Check if all order details have been checked
            const allDetailsChecked = checkQuality.orderDetail.order.orderDetails.every((detail) => {
                const detailCheckQualities = detail.checkQualities || []
                return detailCheckQualities.some((check) => {
                    //if current check, skip
                    if (check.id === checkQualityId) {
                        return true
                    }
                    return check.status !== QualityCheckStatus.PENDING
                })
            })

            if (allDetailsChecked) {
                let hasFailedChecks: boolean = false
                // Check if any order details failed quality check
                if (failedQuantity > 0) {
                    hasFailedChecks = true
                } else {
                    const order = await tx.order.findFirst({
                        where: {
                            id: checkQuality.orderDetail.order.id
                        },
                        include: {
                            orderDetails: {
                                include: {
                                    checkQualities: true
                                }
                            }
                        }
                    })

                    // check if any latest order detail failed quality check
                    hasFailedChecks = order.orderDetails.some((detail) => {
                        const detailCheckQuality = detail.checkQualities[detail.checkQualities.length - 1]
                        return detailCheckQuality.status === QualityCheckStatus.REJECTED
                    })
                }

                if (hasFailedChecks) {
                    // Update failed order details to REWORK_REQUIRED
                    await tx.orderDetail.updateMany({
                        where: {
                            orderId: checkQuality.orderDetail.order.id,
                            checkQualities: {
                                some: {
                                    status: QualityCheckStatus.REJECTED
                                }
                            }
                        },
                        data: {
                            status: OrderDetailStatus.REWORK_REQUIRED
                        }
                    })

                    // Update order status to REWORK_REQUIRED
                    await tx.order.update({
                        where: { id: checkQuality.orderDetail.order.id },
                        data: {
                            status: OrderStatus.REWORK_REQUIRED,
                            orderProgressReports: {
                                create: {
                                    reportDate: now,
                                    note: "Some items failed quality check. Rework required.",
                                    imageUrls: []
                                }
                            }
                        }
                    })

                    // Notify factory about rework requirement
                    await this.notificationsService.create({
                        title: "Rework Required",
                        content: `Some items in order #${checkQuality.orderDetail.order.id} failed quality check. Rework is required.`,
                        userId: checkQuality.orderDetail.order.factoryId,
                        url: `/factory/orders/${checkQuality.orderDetail.order.id}`
                    })

                    // Notify customer about quality check results
                    await this.notificationsService.create({
                        title: "Quality Check Results",
                        content: `Some items in your order #${checkQuality.orderDetail.order.id} failed quality check. The factory will perform rework.`,
                        userId: checkQuality.orderDetail.order.customer.id,
                        url: `/orders/${checkQuality.orderDetail.order.id}`
                    })
                } else {
                    // Update all order details to READY_FOR_SHIPPING
                    await tx.orderDetail.updateMany({
                        where: {
                            orderId: checkQuality.orderDetail.order.id
                        },
                        data: {
                            status: OrderDetailStatus.READY_FOR_SHIPPING
                        }
                    })

                    // Update order status to READY_FOR_SHIPPING
                    await tx.order.update({
                        where: { id: checkQuality.orderDetail.order.id },
                        data: {
                            status: OrderStatus.READY_FOR_SHIPPING,
                            currentProgress: 70,
                            doneCheckQualityAt: now,
                            orderProgressReports: {
                                create: {
                                    reportDate: now,
                                    note: "All items passed quality check. Ready for shipping.",
                                    imageUrls: []
                                }
                            }
                        }
                    })

                    // Create shipping third party task
                    await this.shippingService.createShippingOrder(checkQuality.orderDetail.order.id)
                    // Notify factory about shipping preparation
                    await this.notificationsService.create({
                        title: "Ready for Shipping",
                        content: `Order #${checkQuality.orderDetail.order.id} has passed quality check and is ready for shipping.`,
                        userId: checkQuality.orderDetail.order.factoryId,
                        url: `/factory/orders/${checkQuality.orderDetail.order.id}`
                    })

                    // Notify customer about quality check results
                    await this.notificationsService.create({
                        title: "Quality Check Completed",
                        content: `All items in your order #${checkQuality.orderDetail.order.id} have passed quality check and are ready for shipping.`,
                        userId: checkQuality.orderDetail.order.customer.id,
                        url: `/orders/${checkQuality.orderDetail.order.id}`
                    })
                }
            }

            return updatedCheckQuality
        })
    }

    async startRework(orderId: string, factoryId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order with its details
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    orderDetails: {
                        where: {
                            status: OrderDetailStatus.REWORK_REQUIRED
                        }
                    },
                    customer: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.factoryId !== factoryId) {
                throw new BadRequestException("This order is not assigned to your factory")
            }

            if (order.status !== OrderStatus.REWORK_REQUIRED) {
                throw new BadRequestException("This order is not in REWORK_REQUIRED status")
            }

            // Get system config for order
            const systemConfig = await tx.systemConfigOrder.findUnique({
                where: { type: "SYSTEM_CONFIG_ORDER" }
            })

            if (!systemConfig) {
                throw new BadRequestException("System configuration not found")
            }

            // Check if any order detail has exceeded the rework limit
            const orderDetailsWithReworkCount = await tx.orderDetail.findMany({
                where: {
                    orderId: orderId,
                    status: OrderDetailStatus.REWORK_REQUIRED
                },
                select: {
                    id: true,
                    reworkTime: true
                }
            })

            const exceededReworkLimit = orderDetailsWithReworkCount.some(
                (detail) => detail.reworkTime >= systemConfig.limitReworkTimes
            )

            if (exceededReworkLimit) {
                // Update order status to NEED_MANAGER_HANDLE
                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: OrderStatus.NEED_MANAGER_HANDLE,
                        orderProgressReports: {
                            create: {
                                reportDate: now,
                                note: `Order has exceeded the maximum rework limit of ${systemConfig.limitReworkTimes}. Manual intervention required.`,
                                imageUrls: []
                            }
                        }
                    }
                })

                // Create notification for managers
                await this.notificationsService.createForUsersByRoles({
                    title: "Order Exceeded Rework Limit",
                    content: `Order #${orderId} has exceeded the maximum rework limit of ${systemConfig.limitReworkTimes}. Manual intervention required.`,
                    roles: ["MANAGER"],
                    url: `/manager/orders/${orderId}`
                })

                throw new BadRequestException(
                    `Order has exceeded the maximum rework limit of ${systemConfig.limitReworkTimes}. Please contact support.`
                )
            }

            // Deduct legitimacy points from the factory for each rework
            await tx.factory.update({
                where: { factoryOwnerId: factoryId },
                data: {
                    legitPoint: {
                        decrement: systemConfig.reduceLegitPointIfReject
                    }
                }
            })

            // Create notification for factory about legitimacy point deduction
            await this.notificationsService.create({
                title: "Legitimacy Points Deducted",
                content: `Your factory has lost ${systemConfig.reduceLegitPointIfReject} legitimacy points due to rework requirement for order #${orderId}.`,
                userId: factoryId,
                url: `/factory/orders/${orderId}`
            })

            // Calculate estimated check quality time
            const estimatedCheckQualityAt = new Date(
                now.getTime() + systemConfig.checkQualityTimesDays * 24 * 60 * 60 * 1000
            )

            // Calculate estimated completion time (check quality + shipping days)
            const estimatedCompletionAt = new Date(
                estimatedCheckQualityAt.getTime() + systemConfig.shippingDays * 24 * 60 * 60 * 1000
            )

            // Update order status
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.REWORK_IN_PROGRESS,
                    currentProgress: 45,
                    estimatedCheckQualityAt,
                    estimatedCompletionAt,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: `Rework started by factory. Factory lost ${systemConfig.reduceLegitPointIfReject} legitimacy points.`,
                            imageUrls: []
                        }
                    }
                }
            })

            // Update order details status
            await tx.orderDetail.updateMany({
                where: {
                    orderId: orderId,
                    status: OrderDetailStatus.REWORK_REQUIRED
                },
                data: {
                    status: OrderDetailStatus.REWORK_IN_PROGRESS,
                    reworkTime: {
                        increment: 1
                    }
                }
            })

            //get staff if from factoryId
            const factory = await tx.factory.findFirst({
                where: {
                    factoryOwnerId: factoryId
                },
                include: {
                    staff: true
                }
            })

            // Create tasks and check qualities for rework
            for (const orderDetail of order.orderDetails) {
                const task = await tx.task.create({
                    data: {
                        taskname: `Quality check for rework order ${orderId}`,
                        description: `Quality check for rework design ${orderDetail.designId}`,
                        startDate: now,
                        expiredTime: estimatedCheckQualityAt,
                        taskType: TaskType.QUALITY_CHECK,
                        orderId: order.id,
                        status: TaskStatus.PENDING,
                        userId: factory.staff.id 
                    }
                })

                await tx.checkQuality.create({
                    data: {
                        taskId: task.id,
                        orderDetailId: orderDetail.id,
                        totalChecked: orderDetail.rejectedQty,
                        passedQuantity: 0,
                        failedQuantity: 0,
                        status: QualityCheckStatus.PENDING,
                        checkedAt: now
                    }
                })
            }

            // Notify customer about rework start
            await this.notificationsService.create({
                title: "Rework Started",
                content: `The factory has started reworking your order #${orderId}.`,
                userId: order.customer.id,
                url: `/orders/${orderId}`
            })

            return order
        })
    }

    async doneReworkForOrderDetails(orderDetailId: string, factoryId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order detail with its order
            const orderDetail = await tx.orderDetail.findUnique({
                where: { id: orderDetailId },
                include: {
                    order: {
                        include: {
                            orderDetails: true,
                            tasks: true,
                            customer: true
                        }
                    }
                }
            })

            if (!orderDetail) {
                throw new BadRequestException("Order detail not found")
            }

            if (orderDetail.order.factoryId !== factoryId) {
                throw new BadRequestException("This order is not assigned to your factory")
            }

            if (orderDetail.status !== OrderDetailStatus.REWORK_IN_PROGRESS) {
                throw new BadRequestException(
                    "This order detail is not in REWORK_IN_PROGRESS status"
                )
            }

            // Update order detail status to REWORK_DONE
            await tx.orderDetail.update({
                where: { id: orderDetailId },
                data: {
                    status: OrderDetailStatus.REWORK_DONE,
                    updatedAt: now
                }
            })

            // Create progress report
            await tx.orderProgressReport.create({
                data: {
                    orderId: orderDetail.order.id,
                    reportDate: now,
                    note: `Rework completed for order detail ${orderDetailId} with quantity ${orderDetail.rejectedQty}`,
                    imageUrls: []
                }
            })

            // Check if all rework order details are done
            const allReworkDone = orderDetail.order.orderDetails.every(
                (detail) => {
                    if(detail.id === orderDetailId) {
                        return true
                    }
                    return detail.status !== OrderDetailStatus.REWORK_IN_PROGRESS
                }
            )

            console.log("allReworkDone", allReworkDone, orderDetail.order.orderDetails)

            if (allReworkDone) {
                // Update all rework done order details to WAITING_FOR_CHECKING_QUALITY
                await tx.orderDetail.updateMany({
                    where: {
                        orderId: orderDetail.order.id,
                        status: OrderDetailStatus.REWORK_DONE
                    },
                    data: {
                        status: OrderDetailStatus.WAITING_FOR_CHECKING_QUALITY
                    }
                })

                // Update order status to WAITING_FOR_CHECKING_QUALITY
                await tx.order.update({
                    where: { id: orderDetail.order.id },
                    data: {
                        status: OrderStatus.WAITING_FOR_CHECKING_QUALITY,
                        currentProgress: 50,
                        orderProgressReports: {
                            create: {
                                reportDate: now,
                                note: "All rework completed. Moving to quality check phase.",
                                imageUrls: []
                            }
                        }
                    }
                })

                // Update all quality check tasks to IN_PROGRESS
                const qualityCheckTasks = orderDetail.order.tasks.filter(
                    (task) => task.taskType === TaskType.QUALITY_CHECK
                )

                for (const task of qualityCheckTasks) {
                    await tx.task.update({
                        where: { id: task.id },
                        data: {
                            status: TaskStatus.IN_PROGRESS
                        }
                    })
                }

                // Notify customer about rework completion
                await this.notificationsService.create({
                    title: "Rework Completed",
                    content: `The factory has completed reworking your order #${orderDetail.order.id}. Quality check is in progress.`,
                    userId: orderDetail.order.customer.id,
                    url: `/orders/${orderDetail.order.id}`
                })
            }

            return orderDetail
        })
    }

    async shippedOrder(orderId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order with its details
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    orderDetails: true,
                    customer: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.status !== OrderStatus.SHIPPING) {
                throw new BadRequestException("This order is not in SHIPPING status")
            }

            // Update all order details to SHIPPED
            await tx.orderDetail.updateMany({
                where: {
                    orderId: orderId
                },
                data: {
                    status: OrderDetailStatus.SHIPPED
                }
            })

            // Update order status to SHIPPED
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.SHIPPED,
                    shippedAt: now,
                    currentProgress: 90,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: "Order has been shipped",
                            imageUrls: []
                        }
                    }
                },
                include: {
                    orderDetails: true,
                    customer: true
                }
            })

            // Notify customer about shipment
            await this.notificationsService.create({
                title: "Order Shipped",
                content: `Your order #${orderId} has been shipped and is on its way to you.`,
                userId: order.customer.id,
                url: `/orders/${orderId}`
            })

            return updatedOrder
        })
    }

    async feedbackOrder(orderId: string, customerId: string, input: FeedbackOrderInput) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    factory: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.customerId !== customerId) {
                throw new BadRequestException("This order does not belong to you")
            }

            if (order.status !== OrderStatus.SHIPPED) {
                throw new BadRequestException("This order is not in SHIPPED status")
            }

            // Update all order details to COMPLETED
            await tx.orderDetail.updateMany({
                where: {
                    orderId: orderId
                },
                data: {
                    status: OrderDetailStatus.COMPLETED
                }
            })

            // Update order status to COMPLETED and add feedback
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.COMPLETED,
                    completedAt: now,
                    currentProgress: 100,
                    rating: input.rating,
                    ratingComment: input.ratingComment,
                    ratedAt: now,
                    ratedBy: customerId,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: `Order completed with rating ${input.rating}${input.ratingComment ? `: ${input.ratingComment}` : ""}`,
                            imageUrls: []
                        }
                    }
                },
                include: {
                    orderDetails: true,
                    factory: true
                }
            })

            // Notify factory about order completion and rating
            await this.notificationsService.create({
                title: "Order Completed",
                content: `Order #${orderId} has been completed with a rating of ${input.rating}${input.ratingComment ? `. Comment: ${input.ratingComment}` : ""}`,
                userId: order.factory.factoryOwnerId,
                url: `/factory/orders/${orderId}`
            })

            return updatedOrder
        })
    }

    async getOrdersByFactoryId(factoryId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                factoryId: factoryId
            },
            orderBy: { orderDate: 'desc' }
        })

        return orders.map((order) => new OrderEntity(order))
    }

    async changeOrderToShipping(orderId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order
            const order = await tx.order.findUnique({ 
                where: { id: orderId },
                include: {
                    orderDetails: true,
                    customer: true,
                    factory: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.status !== OrderStatus.READY_FOR_SHIPPING) {
                throw new BadRequestException("This order is not in READY_FOR_SHIPPING status")
            }

            // Update order status to SHIPPING
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.SHIPPING,
                    sendForShippingAt: now,
                    currentProgress: 85,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: "Order has been sent for shipping",
                            imageUrls: []
                        }
                    }
                }
            })

            // Update all order details to SHIPPING
            await tx.orderDetail.updateMany({
                where: {
                    orderId: orderId
                },
                data: { status: OrderDetailStatus.SHIPPING }
            })

            // Notify factory about shipping status
            await this.notificationsService.create({
                title: "Order Ready for Shipping",
                content: `Order #${orderId} has been marked as ready for shipping. Please prepare the shipment.`,
                userId: order.factory.factoryOwnerId,
                url: `/factory/orders/${orderId}`
            })

            // Notify customer about shipping status
            await this.notificationsService.create({
                title: "Order Being Shipped",
                content: `Your order #${orderId} is being prepared for shipping.`,
                userId: order.customer.id,
                url: `/orders/${orderId}`
            })

            return updatedOrder
        })
    }
}
