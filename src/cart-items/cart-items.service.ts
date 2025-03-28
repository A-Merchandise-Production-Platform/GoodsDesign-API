import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateCartItemDto, UpdateCartItemDto } from "./dto"
import { CartItemEntity } from "./entities/cart-items.entity"
import { UserEntity } from "src/users"

@Injectable()
export class CartItemsService {
    constructor(private prisma: PrismaService) {}

    async ensureUserIsAuthenticated(user: UserEntity) {
        if (!user) {
            throw new UnauthorizedException("Not authorized")
        }

        return user
    }

    async getCartItemCount(userId: string): Promise<number> {
        const count = await this.prisma.cartItem.count({
            where: { userId }
        })

        return count
    }

    async addDesignToCart(
        createCartItemDto: CreateCartItemDto,
        userId: string
    ): Promise<CartItemEntity> {
        // Check if design exists in user's cart
        const existingUserCartItem = await this.prisma.cartItem.findFirst({
            where: {
                userId,
                designId: createCartItemDto.designId
            }
        })

        if (existingUserCartItem) {
            // Update quantity if item exists
            return this.updateCartItemQuantity(
                existingUserCartItem.id,
                {
                    quantity: existingUserCartItem.quantity + createCartItemDto.quantity
                },
                userId
            )
        }

        // Create new cart item if it doesn't exist
        const cartItemWithDesign = await this.prisma.cartItem.create({
            data: {
                ...createCartItemDto,
                userId
            },
            include: {
                design: true
            }
        })

        return new CartItemEntity(cartItemWithDesign)
    }

    async getUserCartItems(userId: string): Promise<CartItemEntity[]> {
        const userCartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                design: {
                    include: {
                        blankVariant: {
                            include: {
                                product: true,
                                systemVariant: true
                            }
                        },
                        designPositions: {
                            include: {
                                positionType: true
                            }
                        }
                    },
                },
            }
        })

        return userCartItems.map((item) => new CartItemEntity(item))
    }

    async getCartItemById(id: string, userId: string): Promise<CartItemEntity> {
        const cartItemWithDesign = await this.prisma.cartItem.findFirst({
            where: {
                id,
                userId
            },
            include: {
                design: true
            }
        })

        if (!cartItemWithDesign) {
            throw new NotFoundException(`Cart item with ID ${id} not found`)
        }

        return new CartItemEntity(cartItemWithDesign)
    }

    async updateCartItemQuantity(
        id: string,
        updateCartItemDto: UpdateCartItemDto,
        userId: string
    ): Promise<CartItemEntity> {
        // Verify item exists and belongs to user
        const existingUserCartItem = await this.prisma.cartItem.findFirst({
            where: { id }
        })

        if (!existingUserCartItem) {
            throw new NotFoundException(`Cart item with ID ${id} not found`)
        }

        if (existingUserCartItem.userId !== userId) {
            throw new UnauthorizedException(`Cannot update cart item that belongs to another user`)
        }

        const updatedCartItem = await this.prisma.cartItem.update({
            where: { id },
            data: updateCartItemDto,
            include: {
                design: true
            }
        })

        return new CartItemEntity(updatedCartItem)
    }

    async removeCartItem(id: string, userId: string): Promise<CartItemEntity> {
        // Verify item exists and belongs to user
        const existingUserCartItem = await this.prisma.cartItem.findFirst({
            where: { id }
        })

        if (!existingUserCartItem) {
            throw new NotFoundException(`Cart item with ID ${id} not found`)
        }

        if (existingUserCartItem.userId !== userId) {
            throw new UnauthorizedException(`Cannot delete cart item that belongs to another user`)
        }

        const removedCartItem = await this.prisma.cartItem.delete({
            where: { id },
            include: {
                design: true
            }
        })

        return new CartItemEntity(removedCartItem)
    }

    async removeAllUserCartItems(userId: string): Promise<void> {
        await this.prisma.cartItem.deleteMany({
            where: { userId }
        })
    }
}
