import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { CustomerOrdersService } from "./customer-orders.service"
import { CustomerOrderEntity } from "./entities/customer-order.entity"
import { CreateOrderDto } from "./dto"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { UserEntity } from "../users/entities/users.entity"

@Resolver(() => CustomerOrderEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class CustomerOrdersResolver {
    constructor(private customersOrdersService: CustomerOrdersService) {}

    @Query(() => [CustomerOrderEntity], { name: "userOrders" })
    async getUserOrders(@CurrentUser() user: UserEntity): Promise<CustomerOrderEntity[]> {
        return this.customersOrdersService.findAll(user.id)
    }

    @Query(() => CustomerOrderEntity, { name: "userOrder" })
    async getUserOrder(
        @Args("userOrderId") userOrderId: string,
        @CurrentUser() user: UserEntity
    ): Promise<CustomerOrderEntity> {
        return this.customersOrdersService.findOne(userOrderId, user.id)
    }

    @Mutation(() => CustomerOrderEntity, { name: "createOrder" })
    async createOrder(
        @Args("createOrderInput") createOrderDto: CreateOrderDto,
        @CurrentUser() user: UserEntity
    ): Promise<CustomerOrderEntity> {
        return this.customersOrdersService.create(createOrderDto, user.id)
    }
}
