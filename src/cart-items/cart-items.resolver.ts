import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { CartItemsService } from "./cart-items.service"
import { CartItemEntity } from "./entities/cart-items.entity"
import { CreateCartItemDto, UpdateCartItemDto } from "./dto"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { UserEntity } from "src/users/entities/users.entity"

@Resolver(() => CartItemEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class CartItemsResolver {
    constructor(private cartItemsService: CartItemsService) {}

    @Query(() => [CartItemEntity], { name: "userCartItems" })
    async getUserCartItems(
        @CurrentUser() user: UserEntity
    ): Promise<CartItemEntity[]> {
        return this.cartItemsService.findAll(user.id)
    }
// get all cart-items in system
    @Query(() => [CartItemEntity], { name: "allCartItems" })
    async getAllCartItems(): Promise<CartItemEntity[]> {
        return this.cartItemsService.findAllItems()
    }

    @Query(() => CartItemEntity, { name: "cartItem" }) // get cart-items of current user
    async getCartItem(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<CartItemEntity> {
        return this.cartItemsService.findOne(id, user.id)
    }

    @Mutation(() => CartItemEntity, { name: "createCartItem" })
    async createCartItem(
        @Args("createCartItemInput") createCartItemDto: CreateCartItemDto,
        @CurrentUser() user: UserEntity
    ): Promise<CartItemEntity> {
        return this.cartItemsService.create(createCartItemDto, user.id)
    }

    @Mutation(() => CartItemEntity, { name: "updateCartItem" })
    async updateCartItem(
        @Args("id") id: string,
        @Args("updateCartItemInput") updateCartItemDto: UpdateCartItemDto,
        @CurrentUser() user: UserEntity
    ): Promise<CartItemEntity> {
        return this.cartItemsService.update(id, updateCartItemDto, user.id)
    }

    @Mutation(() => CartItemEntity, { name: "deleteCartItem" })
    async deleteCartItem(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<CartItemEntity> {
        return this.cartItemsService.remove(id, user.id)
    }

    @Mutation(() => Boolean, { name: "clearCart" })
    async clearCart(
        @CurrentUser() user: UserEntity
    ): Promise<boolean> {
        await this.cartItemsService.clearCart(user.id)
        return true
    }
}
