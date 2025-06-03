import { BadRequestException, Injectable } from "@nestjs/common"
import {
    OrderDetailStatus,
    OrderStatus,
    QualityCheckStatus,
    TaskStatus,
    TaskType,
    VoucherType
} from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { CreateOrderInput } from "./dto/create-order.input"
import { OrderEntity } from "./entities/order.entity"
import { FeedbackOrderInput } from "./dto/feedback-order.input"
import { NotificationsService } from "src/notifications/notifications.service"
import { ShippingService } from "src/shipping/shipping.service"
import { OrderProgressReportEntity } from "./entities/order-progress-report.entity"
import { VouchersService } from "src/vouchers/vouchers.service"
import { SystemConfigOrderService } from "src/system-config-order/system-config-order.service"
import { MailService } from "@/mail"
import { AlgorithmService } from "@/algorithm/algorithm.service"
import { FactoryScoreResponse } from "./dto/factory-scores.response"

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService,
        private readonly shippingService: ShippingService,
        private readonly vouchersService: VouchersService,
        private readonly systemConfigOrderService: SystemConfigOrderService,
        private readonly mailService: MailService,
        private readonly algorithmService: AlgorithmService
    ) {}

    async create(createOrderInput: CreateOrderInput, userId: string) {
        const { orderDetails, evaluationCriteriaIds, ...orderData } = createOrderInput

        // Validate order items
        if (!orderDetails.length) {
            throw new BadRequestException("Order must contain at least one item")
        }

        console.log("evaluationCriteriaIds", evaluationCriteriaIds)
        // Validate evaluation criteria
        if (
            evaluationCriteriaIds &&
            evaluationCriteriaIds.length >
                (await this.systemConfigOrderService.findOne()).maxEvaluationCriteria
        ) {
            throw new BadRequestException("Evaluation criteria exceeds the maximum allowed")
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
                    id: { in: orderDetails.map((v) => v.cartItemId) },
                    userId: userId
                },
                include: {
                    systemConfigVariant: true,
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
            if (cartItems.length !== orderDetails.length) {
                throw new BadRequestException("Some cart items were not found")
            }

            let totalOrderPrice = 0

            // Group cart items by designId to calculate total quantity for each design
            const designQuantities = new Map<string, number>()
            cartItems.forEach((cartItem) => {
                const designId = cartItem.design.id
                const currentQuantity = designQuantities.get(designId) || 0
                designQuantities.set(designId, currentQuantity + cartItem.quantity)
            })

            // Update all designs to mark as final when ordered
            const uniqueDesignIds = [...designQuantities.keys()]
            await tx.productDesign.updateMany({
                where: { id: { in: uniqueDesignIds } },
                data: {
                    isFinalized: true
                }
            })

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

                // Get applicable discount based on total quantity for this design
                const discounts = design.systemConfigVariant.product.discounts || []
                let maxDiscountPercent = 0
                const totalDesignQuantity = designQuantities.get(design.id) || 0

                for (const discount of discounts) {
                    if (
                        totalDesignQuantity >= discount.minQuantity &&
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
                    isRework: false,
                    systemConfigVariantId: cartItem.systemConfigVariantId
                }
            })

            //using calculateShippingCostAndFactoryForCart for shipping fee and factory
            const { shippingFee } =
                await this.shippingService.calculateShippingCostAndFactoryForCart(
                    orderDetails.map((v) => v.cartItemId),
                    orderData.addressId
                )

            console.log("shippingFee", shippingFee)

            // Apply voucher if provided
            if (orderData.voucherId) {
                try {
                    const { finalPrice } = await this.vouchersService.calculateVoucherDiscount(
                        orderData.voucherId,
                        totalOrderPrice
                    )
                    totalOrderPrice = finalPrice
                } catch (error) {
                    console.log("error", error)
                    throw new BadRequestException(error.message)
                }
            }

            const finalTotalPrice = totalOrderPrice + (shippingFee?.total || 0)

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
                    totalPrice: finalTotalPrice,
                    addressId: orderData.addressId,
                    shippingPrice: shippingFee?.total || 0,
                    orderDate: now,
                    totalItems: cartItems.length,
                    voucherId: orderData.voucherId,
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

            // If voucher was used, create the voucher usage record
            if (orderData.voucherId) {
                await this.vouchersService.createVoucherUsage(
                    orderData.voucherId,
                    userId,
                    order.id,
                    tx
                )
            }

            // Create payment
            await tx.payment.create({
                data: {
                    orderId: order.id,
                    customerId: userId,
                    amount: finalTotalPrice,
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

            //noti for customer
            await this.notificationsService.create({
                title: "Order Created",
                content: `Order #${order.id} has been created.`,
                userId: order.customerId,
                url: `/my-order/${order.id}`
            })

            // Remove the ordered items from the cart
            await tx.cartItem.deleteMany({
                where: {
                    id: { in: orderDetails.map((v) => v.cartItemId) },
                    userId: userId
                }
            })

            // If evaluation criteria IDs are provided, create the relationships
            console.log("evaluationCriteriaIds", evaluationCriteriaIds)
            if (evaluationCriteriaIds && evaluationCriteriaIds.length > 0) {
                await tx.orderEvaluationCriteria.createMany({
                    data: evaluationCriteriaIds.map((criteriaId) => ({
                        orderId: order.id,
                        evaluationCriteriaId: criteriaId
                    }))
                })
            }
            console.log("order", order)

            return order
        })
    }

    async findAll() {
        const orders = await this.prisma.order.findMany({
            orderBy: { orderDate: "desc" },
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
                        systemConfigVariant: {
                            include: {
                                product: true
                            }
                        },
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                },
                                failedEvaluationCriteria: {
                                    include: {
                                        evaluationCriteria: true
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
            orderBy: { orderDate: "desc" },
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
                        systemConfigVariant: {
                            include: {
                                product: true
                            }
                        },
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                },
                                failedEvaluationCriteria: {
                                    include: {
                                        evaluationCriteria: true
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
            orderBy: { orderDate: "desc" },
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
                        systemConfigVariant: {
                            include: {
                                product: true
                            }
                        },
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                },
                                failedEvaluationCriteria: {
                                    include: {
                                        evaluationCriteria: true
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
            orderBy: { orderDate: "desc" },
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
                        systemConfigVariant: {
                            include: {
                                product: true
                            }
                        },
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                },
                                failedEvaluationCriteria: {
                                    include: {
                                        evaluationCriteria: true
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
        console.log("id", id)
        const result = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderEvaluationCriteria: {
                    include: {
                        evaluationCriteria: {
                            include: {
                                product: true
                            }
                        }
                    }
                },

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
                        systemConfigVariant: {
                            include: {
                                product: true
                            }
                        },
                        checkQualities: {
                            include: {
                                task: {
                                    include: {
                                        assignee: true
                                    }
                                },
                                failedEvaluationCriteria: {
                                    include: {
                                        evaluationCriteria: true
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
                    orderId: orderId
                },
                data: {
                    userId: order.factory.staffId
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
                url: `/my-order/${orderId}`
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
                url: `/my-order/${orderId}`
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
                        url: `/staff/tasks/${orderDetail.orderId}`
                    })
                }

                // Notify customer about production completion
                await this.notificationsService.create({
                    title: "Production Completed",
                    content: `Production for your order #${orderDetail.order.id} has been completed. Quality check is in progress.`,
                    userId: orderDetail.order.customer.id,
                    url: `/my-order/${orderDetail.order.id}`
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
        imageUrls?: string[],
        failedEvaluationCriteriaIds?: string[]
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
                                    customer: true,
                                    orderEvaluationCriteria: {
                                        include: {
                                            evaluationCriteria: true
                                        }
                                    }
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
                throw new BadRequestException(
                    "Total checked quantity exceeds order detail quantity"
                )
            }

            // Validate passed quantity + failed quantity == total checked quantity
            if (passedQuantity + failedQuantity !== checkQuality.orderDetail.quantity) {
                throw new BadRequestException("Total checked quantity does not match")
            }

            // Validate failed evaluation criteria if provided and quality check failed
            if (
                failedQuantity > 0 &&
                failedEvaluationCriteriaIds &&
                failedEvaluationCriteriaIds.length > 0
            ) {
                // Get order's evaluation criteria IDs
                const orderEvaluationCriteriaIds =
                    checkQuality.orderDetail.order.orderEvaluationCriteria.map(
                        (oec) => oec.evaluationCriteriaId
                    )

                // Check if all failed evaluation criteria belong to the order
                const invalidCriteriaIds = failedEvaluationCriteriaIds.filter(
                    (id) => !orderEvaluationCriteriaIds.includes(id)
                )

                if (invalidCriteriaIds.length > 0) {
                    throw new BadRequestException(
                        `Invalid evaluation criteria IDs: ${invalidCriteriaIds.join(", ")}. These criteria are not part of this order.`
                    )
                }
            }

            // Update check quality
            const updatedCheckQuality = await tx.checkQuality.update({
                where: { id: checkQualityId },
                data: {
                    totalChecked: passedQuantity + failedQuantity,
                    passedQuantity,
                    failedQuantity,
                    status:
                        failedQuantity > 0
                            ? QualityCheckStatus.REJECTED
                            : QualityCheckStatus.APPROVED,
                    note,
                    imageUrls: imageUrls || [],
                    checkedAt: now,
                    checkedBy: staffId
                }
            })

            // Store failed evaluation criteria if quality check failed
            if (
                failedQuantity > 0 &&
                failedEvaluationCriteriaIds &&
                failedEvaluationCriteriaIds.length > 0
            ) {
                await tx.checkQualityFailedEvaluationCriteria.createMany({
                    data: failedEvaluationCriteriaIds.map((criteriaId) => ({
                        checkQualityId: checkQualityId,
                        evaluationCriteriaId: criteriaId
                    }))
                })
            }

            // Update task status to COMPLETED
            await tx.task.update({
                where: { id: checkQuality.taskId },
                data: {
                    status: TaskStatus.COMPLETED,
                    completedDate: now
                }
            })

            // Create progress report with failed evaluation criteria info
            let progressNote = `Quality check completed for order detail ${checkQuality.orderDetailId}. Passed: ${passedQuantity}, Failed: ${failedQuantity}`
            if (
                failedQuantity > 0 &&
                failedEvaluationCriteriaIds &&
                failedEvaluationCriteriaIds.length > 0
            ) {
                const failedCriteriaNames = checkQuality.orderDetail.order.orderEvaluationCriteria
                    .filter((oec) => failedEvaluationCriteriaIds.includes(oec.evaluationCriteriaId))
                    .map((oec) => oec.evaluationCriteria.name)
                progressNote += `. Failed criteria: ${failedCriteriaNames.join(", ")}`
            }

            await tx.orderProgressReport.create({
                data: {
                    orderId: checkQuality.orderDetail.order.id,
                    reportDate: now,
                    note: progressNote,
                    imageUrls: imageUrls || []
                }
            })

            // Update current order detail status based on check result
            await tx.orderDetail.update({
                where: { id: checkQuality.orderDetailId },
                data: {
                    status: OrderDetailStatus.DONE_CHECK_QUALITY,
                    rejectedQty: failedQuantity,
                    completedQty: passedQuantity
                }
            })

            // Check if all order details have been checked
            const allDetailsChecked = checkQuality.orderDetail.order.orderDetails.every(
                (detail) => {
                    if (detail.id === checkQuality.orderDetailId) {
                        return true
                    }
                    // all order detail done check quality
                    return detail.status === OrderDetailStatus.DONE_CHECK_QUALITY
                }
            )

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

                    hasFailedChecks = order.orderDetails.some((detail) => {
                        //check order detail by createdAt
                        return detail.rejectedQty > 0
                    })
                }
                if (hasFailedChecks) {
                    //get all order detail failed
                    const orderDetailsFailed = await tx.orderDetail.findMany({
                        where: {
                            orderId: checkQuality.orderDetail.order.id,
                            rejectedQty: { gt: 0 }
                        }
                    })

                    //update order detail status to REWORK_REQUIRED
                    await tx.orderDetail.updateMany({
                        where: {
                            id: { in: orderDetailsFailed.map((detail) => detail.id) }
                        },
                        data: {
                            status: OrderDetailStatus.REWORK_REQUIRED,
                            isRework: true
                        }
                    })

                    // // Update order status to REWORK_REQUIRED
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
                            orderId: checkQuality.orderDetail.order.id,
                            status: OrderDetailStatus.REWORK_REQUIRED
                        },
                        select: {
                            id: true,
                            reworkTime: true
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
                        url: `/my-order/${checkQuality.orderDetail.order.id}`
                    })

                    this.startRework(
                        checkQuality.orderDetail.order.id,
                        checkQuality.orderDetail.order.factoryId
                    )
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
                        url: `/my-order/${checkQuality.orderDetail.order.id}`
                    })
                }
            }

            // Return the check quality with failed evaluation criteria included
            return await tx.checkQuality.findUnique({
                where: { id: checkQualityId },
                include: {
                    task: true,
                    orderDetail: true,
                    failedEvaluationCriteria: {
                        include: {
                            evaluationCriteria: true
                        }
                    }
                }
            })
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
                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: OrderStatus.NEED_MANAGER_HANDLE_REWORK,
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

                return order
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
                    isDelayed: true,
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

            //get order detail failed quality check
            const orderDetailsFailed = await tx.orderDetail.findMany({
                where: {
                    orderId: orderId,
                    rejectedQty: { gt: 0 }
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
            for (const orderDetail of orderDetailsFailed) {
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

                await tx.orderDetail.update({
                    where: { id: orderDetail.id },
                    data: {
                        status: OrderDetailStatus.REWORK_IN_PROGRESS,
                        isRework: true,
                        reworkTime: { increment: 1 }
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
                url: `/my-order/${orderId}`
            })

            return order
        })
    }

    async startReworkByManager(orderId: string) {
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

            // Get system config for order
            const systemConfig = await tx.systemConfigOrder.findUnique({
                where: { type: "SYSTEM_CONFIG_ORDER" }
            })

            if (!systemConfig) {
                throw new BadRequestException("System configuration not found")
            }

            // Deduct legitimacy points from the factory for each rework
            await tx.factory.update({
                where: { factoryOwnerId: order.factoryId },
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
                userId: order.factoryId,
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
                    isDelayed: true,
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

            //get order detail failed quality check
            const orderDetailsFailed = await tx.orderDetail.findMany({
                where: {
                    orderId: orderId,
                    rejectedQty: { gt: 0 }
                }
            })

            //get staff if from factoryId
            const factory = await tx.factory.findFirst({
                where: {
                    factoryOwnerId: order.factoryId
                },
                include: {
                    staff: true
                }
            })

            // Create tasks and check qualities for rework
            for (const orderDetail of orderDetailsFailed) {
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

                await tx.orderDetail.update({
                    where: { id: orderDetail.id },
                    data: {
                        status: OrderDetailStatus.REWORK_IN_PROGRESS,
                        isRework: true,
                        reworkTime: { increment: 1 }
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
                url: `/my-order/${orderId}`
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
            const allReworkDone = orderDetail.order.orderDetails.every((detail) => {
                if (detail.id === orderDetailId) {
                    return true
                }
                return detail.status !== OrderDetailStatus.REWORK_IN_PROGRESS
            })

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
                    url: `/my-order/${orderDetail.order.id}`
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
                url: `/my-order/${orderId}`
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

    async getAllOrdersByFactoryId(factoryId: string, orderId?: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                factoryId: factoryId,
                ...(orderId && { id: { contains: orderId } })
            },
            orderBy: { orderDate: "desc" },
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
                                },
                                failedEvaluationCriteria: {
                                    include: {
                                        evaluationCriteria: true
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

            try {
                // Create shipping third party task
                const { orderCode } = await this.shippingService.createShippingOrder(orderId)

                // Update order with orderCode
                await tx.order.update({
                    where: { id: orderId },
                    data: { orderCode: orderCode }
                })
            } catch (error) {
                console.log("Third party shipping error: Try again later")
                throw new BadRequestException("Third party shipping error: Try again later")
            }

            try {
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
                    url: `/my-order/${orderId}`
                })
            } catch (error) {
                console.log("Notification error", error)
            }

            return updatedOrder
        })
    }

    /**
     * Adds a progress report to an order
     * @param orderId The ID of the order
     * @param note The note to add to the progress report
     * @param imageUrls Optional array of image URLs to attach to the report
     * @param tx Optional transaction object for use within a transaction
     * @returns The created order progress report
     */
    async addOrderProgressReport(
        orderId: string,
        note: string,
        imageUrls: string[] = [],
        tx?: any
    ): Promise<OrderProgressReportEntity> {
        const prisma = tx || this.prisma
        const now = new Date()

        const report = await prisma.orderProgressReport.create({
            data: {
                orderId,
                reportDate: now,
                note,
                imageUrls
            }
        })

        return new OrderProgressReportEntity(report)
    }

    async reassignNewStaffForOrder(orderId: string, newStaffId: string) {
        // First, check if the order exists
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                factory: {
                    include: {
                        owner: true,
                        staff: true
                    }
                },
                tasks: true,
                customer: true
            }
        })

        if (!order) {
            throw new BadRequestException(`Order with ID ${orderId} not found`)
        }

        if (!order.factoryId) {
            throw new BadRequestException(
                `Order with ID ${orderId} does not have an assigned factory`
            )
        }

        // Check if the new staff exists and has the STAFF role
        const newStaff = await this.prisma.user.findUnique({
            where: { id: newStaffId }
        })

        if (!newStaff) {
            throw new BadRequestException(`User with ID ${newStaffId} not found`)
        }

        if (newStaff.role !== "STAFF") {
            throw new BadRequestException(`User with ID ${newStaffId} is not a staff member`)
        }

        // Check if the new staff is already assigned to another factory
        const existingFactory = await this.prisma.factory.findFirst({
            where: { staffId: newStaffId }
        })

        if (existingFactory && existingFactory.factoryOwnerId !== order.factoryId) {
            throw new BadRequestException(
                `Staff with ID ${newStaffId} is already assigned to another factory`
            )
        }

        // Update the factory with the new staff
        await this.prisma.factory.update({
            where: { factoryOwnerId: order.factoryId },
            data: { staffId: newStaffId }
        })

        // Update all tasks for this order to be assigned to the new staff
        await this.prisma.task.updateMany({
            where: { orderId: orderId },
            data: {
                userId: newStaffId,
                assignedDate: new Date()
            }
        })

        // Add a progress report for this change
        await this.addOrderProgressReport(
            orderId,
            `Staff reassigned to ${newStaff.name || "new staff member"}`,
            []
        )

        // Notify the factory owner about the staff reassignment
        await this.notificationsService.create({
            title: "Staff Reassigned",
            content: `Staff for order #${orderId} has been reassigned to ${newStaff.name || "a new staff member"}.`,
            userId: order.factory.owner.id,
            url: `/factory/orders/${orderId}`
        })

        // Notify the new staff about their assignment
        await this.notificationsService.create({
            title: "New Order Assignment",
            content: `You have been assigned to handle order #${orderId}.`,
            userId: newStaffId,
            url: `/staff/tasks/${orderId}`
        })

        // If there was a previous staff, notify them about being removed
        if (order.factory.staff) {
            await this.notificationsService.create({
                title: "Order Reassignment",
                content: `You have been removed from order #${orderId}.`,
                userId: order.factory.staff.id,
                url: `/staff/tasks`
            })
        }

        // Return the updated order
        return this.findOne(orderId)
    }

    async createRefundForOrder(orderId: string, reason: string = "") {
        return this.prisma.$transaction(async (tx) => {
            // Get the order with its payments
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    payments: true,
                    customer: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            // Check if order can be refunded (add any business logic here)
            if (
                order.status === OrderStatus.WAITING_FOR_REFUND ||
                order.status === OrderStatus.REFUNDED
            ) {
                throw new BadRequestException(
                    "Order is already in refund process or has been refunded"
                )
            }

            // Calculate total paid amount from previous payments
            const totalPaidAmount = order.payments.reduce((sum, payment) => {
                if (payment.type === "DEPOSIT" && payment.status === "COMPLETED") {
                    return sum + payment.amount
                }
                return sum
            }, 0)

            if (totalPaidAmount <= 0) {
                throw new BadRequestException("No payment found for refund")
            }

            // Create refund payment record
            const refundPayment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    customerId: order.customerId,
                    amount: totalPaidAmount,
                    type: "WITHDRAWN",
                    paymentLog: `Refund initiated for order ${order.id}`,
                    createdAt: new Date(),
                    status: "PENDING"
                }
            })

            // check if user have userBank
            const userBank = await tx.userBank.findFirst({
                where: {
                    userId: order.customerId
                }
            })

            let updatedOrder

            if (!userBank) {
                // Update order status
                updatedOrder = await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: OrderStatus.WAITING_FILL_INFORMATION,
                        orderProgressReports: {
                            create: {
                                reportDate: new Date(),
                                note: `Refund process initiated for amount ${totalPaidAmount} ${reason ? `with reason: ${reason}` : ""}`,
                                imageUrls: []
                            }
                        }
                    }
                })

                // Notify customer about refund initiation
                await this.notificationsService.create({
                    title: "Please fill in the information",
                    content: `Please fill in the information for refund order ${orderId}`,
                    userId: order.customerId,
                    url: `/profile/payments`
                })

                //send email to customer
                await this.mailService.sendRefundInformationEmail({
                    to: order.customer.email,
                    orderId: order.id,
                    amount: totalPaidAmount
                })
            } else {
                // Update order status
                updatedOrder = await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: OrderStatus.WAITING_FOR_REFUND,
                        orderProgressReports: {
                            create: {
                                reportDate: new Date(),
                                note: `Refund process initiated for amount ${totalPaidAmount} ${reason ? `with reason: ${reason}` : ""}`,
                                imageUrls: []
                            }
                        }
                    }
                })
            }

            // Notify customer about refund initiation
            await this.notificationsService.create({
                title: "Refund Initiated",
                content: `A refund has been initiated for your order #${orderId}. Amount: ${totalPaidAmount}`,
                userId: order.customerId,
                url: `/my-order/${orderId}`
            })

            // Notify manager
            await this.notificationsService.createForUsersByRoles({
                title: "Refund Initiated",
                content: `A refund has been initiated for your order #${orderId}. Amount: ${totalPaidAmount}`,
                roles: ["MANAGER"],
                url: `/manager/orders/${orderId}`
            })

            //gift voucher for user base on the voucherBaseValueForRefund in system config order
            const systemConfigOrder = await this.systemConfigOrderService.findOne()

            if (systemConfigOrder) {
                await this.vouchersService.createVoucher({
                    value: systemConfigOrder.voucherBaseValueForRefund,
                    type: systemConfigOrder.voucherBaseTypeForRefund,
                    isPublic: false,
                    minOrderValue: 0,
                    limitedUsage: systemConfigOrder.voucherBaseLimitedUsage,
                    userId: order.customerId,
                    description: `Voucher for refund order ${orderId}`,
                    maxDiscountValue:
                        systemConfigOrder.voucherBaseTypeForRefund === VoucherType.PERCENTAGE
                            ? systemConfigOrder.voucherBaseMaxDiscountValue
                            : null
                })
            }
            return updatedOrder
        })
    }

    async assignFactoryToOrder(orderId: string, factoryId: string): Promise<OrderEntity> {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { factoryId: factoryId, status: OrderStatus.PENDING_ACCEPTANCE }
        })
        return order
    }

    async calculateFactoryScoresForOrder(orderId: string): Promise<FactoryScoreResponse[]> {
        return this.algorithmService.calculateFactoryScoresForOrder(orderId)
    }

    async speedUpOrder(orderId: string) {
        const now = new Date()
        const newDeadline = new Date(now.getTime() - 10000) // Add 3 seconds for testing

        return this.prisma.$transaction(async (tx) => {
            // Get the order
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    factory: true,
                    customer: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (order.status !== OrderStatus.PENDING_ACCEPTANCE) {
                throw new BadRequestException("Order must be in PENDING_ACCEPTANCE status")
            }

            // Update order with new deadline
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    acceptanceDeadline: newDeadline,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: `Order acceptance deadline has been updated to ${newDeadline}`,
                            imageUrls: []
                        }
                    }
                }
            })

            // Notify factory about deadline change
            await this.notificationsService.create({
                title: "Order Acceptance Deadline Updated",
                content: `The acceptance deadline for order #${orderId} has been updated. Please respond within the new deadline.`,
                userId: order.factory.factoryOwnerId,
                url: `/factory/orders/${orderId}`
            })

            return updatedOrder
        })
    }

    async getOrderPriceDetails(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderDetails: {
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
                },
                voucher: true
            }
        })

        if (!order) {
            throw new BadRequestException("Order not found")
        }

        // Calculate base price (before any discounts)
        let basePrice = 0
        let maxDiscountPercent = 0

        // Group items by design to calculate quantity-based discounts
        const designQuantities = new Map<string, number>()
        order.orderDetails.forEach((detail) => {
            const designId = detail.design.id
            const currentQuantity = designQuantities.get(designId) || 0
            designQuantities.set(designId, currentQuantity + detail.quantity)
        })

        // Calculate prices and find max discount
        order.orderDetails.forEach((detail) => {
            const design = detail.design

            // Calculate item base price: variant price + sum of all position prices
            const blankPrice = design.systemConfigVariant.price || 0
            const positionPrices = design.designPositions.reduce((sum, position) => {
                if (position.designJSON && Object.keys(position.designJSON).length > 0) {
                    return sum + position.positionType.basePrice
                }
                return sum
            }, 0)

            const baseItemPrice = blankPrice + positionPrices
            basePrice += baseItemPrice * detail.quantity

            // Find max discount based on total quantity for this design
            const discounts = design.systemConfigVariant.product.discounts || []
            const totalDesignQuantity = designQuantities.get(design.id) || 0

            for (const discount of discounts) {
                if (
                    totalDesignQuantity >= discount.minQuantity &&
                    discount.discountPercent > maxDiscountPercent
                ) {
                    maxDiscountPercent = discount.discountPercent
                }
            }
        })

        // Calculate price after discount
        const priceAfterDiscount = basePrice * (1 - maxDiscountPercent)

        // Calculate price after voucher
        let priceAfterVoucher = priceAfterDiscount
        let voucherData = null

        if (order.voucher) {
            try {
                const voucherResult =
                    await this.vouchersService.calculateVoucherDiscountWithoutValidation(
                        order.voucher.id,
                        priceAfterDiscount
                    )
                priceAfterVoucher = voucherResult.finalPrice
                voucherData = order.voucher
            } catch (error) {
                // If voucher calculation fails, continue without voucher
                console.error("Voucher calculation failed:", error)
            }
        }

        return {
            basePrice,
            discountPercentage: maxDiscountPercent * 100, // Convert to percentage
            priceAfterDiscount,
            voucher: voucherData,
            priceAfterVoucher,
            shippingPrice: order.shippingPrice,
            finalPrice: priceAfterVoucher + order.shippingPrice
        }
    }

    async transferOrderToFactory(orderId: string, newFactoryId: string) {
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            // Get the order with its details
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    factory: true,
                    customer: true,
                    orderDetails: true
                }
            })

            if (!order) {
                throw new BadRequestException("Order not found")
            }

            if (!order.factoryId) {
                throw new BadRequestException("Order is not assigned to any factory")
            }

            if (order.factoryId === newFactoryId) {
                throw new BadRequestException("Order is already assigned to this factory")
            }

            // Get system config for order
            const systemConfig = await tx.systemConfigOrder.findUnique({
                where: { type: "SYSTEM_CONFIG_ORDER" }
            })

            if (!systemConfig) {
                throw new BadRequestException("System configuration not found")
            }

            // Calculate new deadlines based on system config
            const estimatedCheckQualityAt = new Date(
                now.getTime() + systemConfig.checkQualityTimesDays * 24 * 60 * 60 * 1000
            )
            const estimatedDoneProductionAt = new Date(
                now.getTime() + systemConfig.shippingDays * 24 * 60 * 60 * 1000
            )
            const estimatedCompletionAt = new Date(
                now.getTime() + (systemConfig.shippingDays + 2) * 24 * 60 * 60 * 1000
            )

            // Create rejected order record for the old factory
            await tx.rejectedOrder.create({
                data: {
                    orderId,
                    factoryId: order.factoryId,
                    reason: "Order transferred to another factory",
                    rejectedAt: now
                }
            })

            // Update factory legit points for the old factory
            await tx.factory.update({
                where: { factoryOwnerId: order.factoryId },
                data: {
                    legitPoint: {
                        decrement: systemConfig.reduceLegitPointIfReject
                    }
                }
            })

            // Get the new factory's staff
            const newFactory = await tx.factory.findUnique({
                where: { factoryOwnerId: newFactoryId },
                include: {
                    staff: true
                }
            })

            if (!newFactory) {
                throw new BadRequestException("New factory not found")
            }

            if (!newFactory.staff) {
                throw new BadRequestException("New factory does not have assigned staff")
            }

            // Update order with new factory and status
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    factoryId: newFactoryId,
                    status: OrderStatus.PENDING_ACCEPTANCE,
                    assignedAt: now,
                    acceptanceDeadline: new Date(
                        now.getTime() + systemConfig.acceptHoursForFactory * 60 * 60 * 1000
                    ),
                    currentProgress: 10,
                    isDelayed: true,
                    estimatedCheckQualityAt,
                    estimatedDoneProductionAt,
                    estimatedCompletionAt,
                    orderProgressReports: {
                        create: {
                            reportDate: now,
                            note: `Order transferred from factory ${order.factoryId} to factory ${newFactoryId}`,
                            imageUrls: []
                        }
                    }
                }
            })

            // Update all order details back to PENDING
            await tx.orderDetail.updateMany({
                where: {
                    orderId: orderId
                },
                data: {
                    status: OrderDetailStatus.PENDING,
                    completedQty: 0,
                    rejectedQty: 0
                }
            })

            // Create new tasks for the new factory's staff
            for (const orderDetail of order.orderDetails) {
                const task = await tx.task.create({
                    data: {
                        taskname: `Quality check for order ${orderId}`,
                        description: `Quality check for design ${orderDetail.designId}`,
                        startDate: now,
                        expiredTime: estimatedCheckQualityAt,
                        taskType: TaskType.QUALITY_CHECK,
                        orderId: order.id,
                        status: TaskStatus.PENDING,
                        userId: newFactory.staff.id
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

            // Notify old factory about transfer
            await this.notificationsService.create({
                title: "Order Transferred",
                content: `Order #${orderId} has been transferred to another factory. Your factory has lost ${systemConfig.reduceLegitPointIfReject} legitimacy points.`,
                userId: order.factory.factoryOwnerId,
                url: `/factory/orders/${orderId}`
            })

            // Notify new factory about new order
            await this.notificationsService.create({
                title: "New Order Assignment",
                content: `You have been assigned order #${orderId}. Please accept or reject within ${systemConfig.acceptHoursForFactory} hours.`,
                userId: newFactoryId,
                url: `/factory/orders/${orderId}`
            })

            // Notify customer about factory transfer
            await this.notificationsService.create({
                title: "Order Factory Changed",
                content: `Your order #${orderId} has been transferred to a new factory.`,
                userId: order.customer.id,
                url: `/my-order/${orderId}`
            })

            return updatedOrder
        })
    }
}
