import { BadRequestException, Injectable } from "@nestjs/common"
import { OrderStatus, PaymentStatus, PaymentType, QualityCheckStatus, ReworkStatus } from "@prisma/client"
import { CartItemsService } from "../cart-items/cart-items.service"
import { PrismaService } from "../prisma/prisma.service"
import { SystemConfigDiscountService } from "../system-config-discount/system-config-discount.service"
import { CreateOrderDto } from "./dto"
import { CustomerOrderEntity } from "./entities/customer-order.entity"

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

        console.log(createOrderDto.orderDetails, userId)

        // Calculate total price of all order details
        let totalOrderPrice = 0

        // // Start a transaction
        return this.prisma.$transaction(async (tx) => {

            const cartItems = await tx.cartItem.findMany({
                where: {
                    id: { in: createOrderDto.orderDetails.map((v) => v.cartItemId) },
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
            if (cartItems.length !== createOrderDto.orderDetails.length) {
                throw new BadRequestException("Some cart items were not found");
            }

            const orderDetailsToCreate = cartItems.map(cartItem => {
                const design = cartItem.design;
                
                // Calculate item price: variant price + sum of all position prices
                const blankPrice = design.systemConfigVariant.price;
                const positionPrices = design.designPositions.reduce(
                    (sum, position) => sum + position.positionType.basePrice,
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
                    status: OrderStatus.PENDING,
                    qualityCheckStatus: QualityCheckStatus.PENDING,
                    reworkStatus: ReworkStatus.NOT_REQUIRED,
                };
            });
    
            // Create the order
            const order = await tx.customerOrder.create({
                data: {
                    customerId: userId,
                    status: OrderStatus.PENDING,
                    totalPrice: totalOrderPrice,
                    shippingPrice: 0, // No shipping price as per requirements
                    depositPaid: 0, // Default to 0, will be updated when payment is processed
                    orderDate: new Date(),
                    orderDetails: {
                        create: orderDetailsToCreate
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
            });
    
            // Create payment
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
            });
    
            // Remove the ordered items from the cart
            await tx.cartItem.deleteMany({
                where: {
                    id: { in: createOrderDto.orderDetails.map(v => v.cartItemId) },
                    userId: userId
                }
            });
    
            return new CustomerOrderEntity(order);
        })
    }

    async findAll(userId: string): Promise<CustomerOrderEntity[]> {
        const orders = await this.prisma.customerOrder.findMany({
            where: { customerId: userId },
            include: {
                orderDetails: {
                    include: {
                        checkQualities: true,
                        design: true,
                        factoryOrderDetails: true
                    }
                },
                payments: {
                    include: {
                        transactions: true,
                    }
                }
            }
        })

        return orders.map((order) => new CustomerOrderEntity(order))
    }

    async findOne(id: string, userId: string): Promise<CustomerOrderEntity> {
        const order = await this.prisma.customerOrder.findFirst({
            where: {
                id,
            },
            include: {
                customer: true,
                orderDetails: true,
                payments: {
                    include: {
                        transactions: true
                    }
                }
            }
        })

        if (!order) {
            throw new BadRequestException(`Order with ID ${id} not found`)
        }

        return new CustomerOrderEntity(order)
    }


}
