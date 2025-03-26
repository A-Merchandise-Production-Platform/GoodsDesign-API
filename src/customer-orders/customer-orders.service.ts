import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CustomerOrderEntity } from "./entities/customer-order.entity"
import { CreateOrderDto } from "./dto"
import { CartItemsService } from "../cart-items/cart-items.service"
import { OrderStatus, PaymentStatus, PaymentType, QualityCheckStatus, ReworkStatus } from "@prisma/client"
import { SystemConfigDiscountService } from "../system-config-discount/system-config-discount.service"

@Injectable()
export class CustomerOrdersService {
    constructor(
        private prisma: PrismaService,
        private cartItemsService: CartItemsService,
        private discountService: SystemConfigDiscountService
    ) {}

    async create(createOrderDto: CreateOrderDto, userId: string): Promise<CustomerOrderEntity> {
        // Validate order items
        if (!createOrderDto.orderDetails.length) {
            throw new BadRequestException("Order must contain at least one item")
        }

        // Calculate total price of all order details
        let totalOrderPrice = 0

        // Start a transaction
        return this.prisma.$transaction(async (tx) => {
            // Get design information for each order detail
            const orderDetailsWithPricing = await Promise.all(
                createOrderDto.orderDetails.map(async (detail) => {
                    // Get the design to calculate the price
                    const design = await tx.productDesign.findUnique({
                        where: { id: detail.designId },
                        include: {
                            blankVariant: true,
                            designPositions: {
                                include: {
                                    positionType: true
                                }
                            }
                        }
                    })

                    if (!design) {
                        throw new BadRequestException(`Design with ID ${detail.designId} not found`)
                    }

                    // Calculate item price: blank price + sum of all position prices
                    const blankPrice = design.blankVariant.blankPrice
                    const positionPrices = design.designPositions.reduce(
                        (sum, position) => sum + position.positionType.basePrice,
                        0
                    )

                    const baseItemPrice = blankPrice + positionPrices

                    // Get applicable discount from configuration based on product and quantity
                    const discount = await this.discountService.getApplicableDiscount(
                        design.blankVariant.productId,
                        detail.quantity
                    )
                    const itemPrice = baseItemPrice * (1 - discount)
                    const detailTotalPrice = itemPrice * detail.quantity

                    totalOrderPrice += detailTotalPrice

                    return {
                        designId: detail.designId,
                        quantity: detail.quantity,
                        price: itemPrice,
                        status: OrderStatus.PENDING,
                        qualityCheckStatus: QualityCheckStatus.PENDING,
                        reworkStatus: ReworkStatus.NOT_REQUIRED,
                        appliedDiscount: discount
                    }
                })
            )

            // Create the order
            const order = await tx.customerOrder.create({
                data: {
                    customerId: userId,
                    status: OrderStatus.PENDING,
                    totalPrice: totalOrderPrice,
                    shippingPrice: createOrderDto.shippingPrice,
                    depositPaid: 0, // Default to 0, will be updated when payment is processed
                    orderDate: new Date(),
                    orderDetails: {
                        create: orderDetailsWithPricing
                    },
                    history: {
                        create: {
                            status: OrderStatus.PENDING.toString(),
                            timestamp: new Date(),
                            note: "Order created"
                        }
                    }
                },
                include: {
                    orderDetails: true
                }
            })

            // create payment
            await tx.payment.create({
                data: {
                    customerId: userId,
                    orderId: order.id,
                    amount: totalOrderPrice,
                    status: PaymentStatus.PENDING,
                    createdAt: new Date(),
                    type: PaymentType.DEPOSIT,
                    paymentLog: "Initial deposit payment for order " + order.id
                }
            })

            // Remove the ordered items from the cart
            await Promise.all(
                createOrderDto.orderDetails.map(async (detail) => {
                    // Find the cart item for this design
                    const cartItem = await tx.cartItem.findFirst({
                        where: {
                            userId,
                            designId: detail.designId
                        }
                    })

                    if (cartItem) {
                        await this.cartItemsService.removeCartItem(cartItem.id, userId)
                    }
                })
            )

            return new CustomerOrderEntity(order)
        })
    }

    async findAll(userId: string): Promise<CustomerOrderEntity[]> {
        const orders = await this.prisma.customerOrder.findMany({
            where: { customerId: userId },
            include: {
                orderDetails: true
            }
        })

        return orders.map((order) => new CustomerOrderEntity(order))
    }

    async findOne(id: string, userId: string): Promise<CustomerOrderEntity> {
        const order = await this.prisma.customerOrder.findFirst({
            where: {
                id,
                customerId: userId
            },
            include: {
                orderDetails: true
            }
        })

        if (!order) {
            throw new BadRequestException(`Order with ID ${id} not found`)
        }

        return new CustomerOrderEntity(order)
    }
}
