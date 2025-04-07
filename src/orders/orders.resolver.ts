import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderEntity } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CurrentUser } from 'src/auth';
import { UserEntity } from 'src/users';

@Resolver(() => OrderEntity)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.create(createOrderInput, user.id);
  }

  @Query(() => [OrderEntity], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => OrderEntity, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.findOne(id);
  }
}
