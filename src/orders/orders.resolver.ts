import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth';
import { UserEntity } from 'src/users';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CreateOrderInput } from './dto/create-order.input';
import { DoneCheckQualityInput } from './dto/done-check-quality.input';
import { FeedbackOrderInput } from './dto/feedback-order.input';
import { CheckQualityEntity } from './entities/check-quality.entity';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';

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

  @Query(() => [OrderEntity], { name: 'myOrders' })
  @UseGuards(GraphqlJwtAuthGuard)
  findMyOrders(@CurrentUser() user: UserEntity) {
    console.log("user", user)
    return this.ordersService.findByCustomerId(user.id);
  }

  @Query(() => [OrderEntity], { name: 'factoryOrders' })
  @UseGuards(GraphqlJwtAuthGuard)
  findFactoryOrders(@CurrentUser() user: UserEntity) {
    return this.ordersService.findByFactoryId(user.id);
  }

  @Query(() => [OrderEntity], { name: 'staffOrders' })
  @UseGuards(GraphqlJwtAuthGuard)
  findStaffOrders(@CurrentUser() user: UserEntity) {
    return this.ordersService.findByStaffId(user.id);
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

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  startRework(
    @Args('orderId', { type: () => String }) orderId: string,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.startRework(orderId, user.id);
  }

  @Mutation(() => OrderDetailEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  doneReworkForOrderDetails(
    @Args('orderDetailId', { type: () => String }) orderDetailId: string,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.doneReworkForOrderDetails(orderDetailId, user.id);
  }

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  shippedOrder(
    @Args('orderId', { type: () => String }) orderId: string
  ) {
    return this.ordersService.shippedOrder(orderId);
  }

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  changeOrderToShipping(
    @Args('orderId', { type: () => String }) orderId: string
  ) {
    return this.ordersService.changeOrderToShipping(orderId);
  }

  @Mutation(() => OrderEntity)
  @UseGuards(GraphqlJwtAuthGuard)
  feedbackOrder(
    @Args('orderId', { type: () => String }) orderId: string,
    @Args('input') input: FeedbackOrderInput,
    @CurrentUser() user: UserEntity
  ) {
    return this.ordersService.feedbackOrder(orderId, user.id, input);
  }
}
