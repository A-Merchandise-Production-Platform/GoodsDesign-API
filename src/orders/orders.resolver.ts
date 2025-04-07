import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderEntity } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CurrentUser } from 'src/auth';
import { UserEntity } from 'src/users';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { CheckQualityEntity } from './entities/check-quality.entity';
import { DoneCheckQualityInput } from './dto/done-check-quality.input';
import { Field, Int } from '@nestjs/graphql';

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

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  acceptOrderForFactory(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.acceptOrderForFactory(orderId, user.id);
  }

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  rejectOrder(
    @Args('orderId', { type: () => String }) orderId: string,
    @Args('reason', { type: () => String }) reason: string,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.rejectOrder(orderId, user.id, reason);
  }

  @Mutation(() => OrderDetailEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  doneProductionOrderDetails(
    @Args('orderDetailId', { type: () => String }) orderDetailId: string,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.doneProductionOrderDetails(orderDetailId, user.id);
  }

  @Mutation(() => CheckQualityEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  doneCheckQuality(
    @Args('input') input: DoneCheckQualityInput,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.doneCheckQuality(
      input.checkQualityId,
      user.id,
      input.passedQuantity,
      input.failedQuantity,
      input.note,
      input.imageUrls
    );
  }
}
