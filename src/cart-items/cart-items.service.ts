import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateCartItemDto, UpdateCartItemDto } from "./dto"
import { CartItemEntity } from "./entities/cart-items.entity"

@Injectable()
export class CartItemsService {
    constructor(private prisma: PrismaService) {}

    async create(createCartItemDto: CreateCartItemDto, userId: string): Promise<CartItemEntity> {
        // Check if design exists in user's cart
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: {
                userId,
                designId: createCartItemDto.designId
            }
        })

        if (existingCartItem) {
            // Update quantity if item exists
            return this.update(existingCartItem.id, {
                quantity: existingCartItem.quantity + createCartItemDto.quantity
            }, userId)
        }

        // Create new cart item if it doesn't exist
        const cartItem = await this.prisma.cartItem.create({
            data: {
                ...createCartItemDto,
                userId
            },
            include: {
                design: true
            }
        })

        return new CartItemEntity(cartItem)
    }

    async findAll(userId: string): Promise<CartItemEntity[]> {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                design: true
            }
        })

        return cartItems.map(item => new CartItemEntity(item))
    }

    async findAllItems(): Promise<CartItemEntity[]> {
        const cartItems = await this.prisma.cartItem.findMany({
            include: {
                design: true,
                user: true
            }
        })

        return cartItems.map(item => new CartItemEntity(item))
    }

    async findOne(id: string, userId: string): Promise<CartItemEntity> {
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id,
                userId
            },
            include: {
                design: true
            }
        })

        if (!cartItem) {
            throw new NotFoundException(`Cart item with ID ${id} not found`)
        }

        return new CartItemEntity(cartItem)
    }

    async update(id: string, updateCartItemDto: UpdateCartItemDto, userId: string): Promise<CartItemEntity> {
        // Verify item exists and belongs to user
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: { id }
        })

        if (!existingCartItem) {
            throw new NotFoundException(`Cart item with ID ${id} not found`)
        }

        if (existingCartItem.userId !== userId) {
            throw new UnauthorizedException(`Cannot update cart item that belongs to another user`)
        }

        const cartItem = await this.prisma.cartItem.update({
            where: { id },
            data: updateCartItemDto,
            include: {
                design: true
            }
        })

        return new CartItemEntity(cartItem)
    }

    async remove(id: string, userId: string): Promise<CartItemEntity> {
        // Verify item exists and belongs to user
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: { id }
        })

        if (!existingCartItem) {
            throw new NotFoundException(`Cart item with ID ${id} not found`)
        }

        if (existingCartItem.userId !== userId) {
            throw new UnauthorizedException(`Cannot delete cart item that belongs to another user`)
        }

        const cartItem = await this.prisma.cartItem.delete({
            where: { id },
            include: {
                design: true
            }
        })

        return new CartItemEntity(cartItem)
    }

    async clearCart(userId: string): Promise<void> {
        await this.prisma.cartItem.deleteMany({
            where: { userId }
        })
    }
}