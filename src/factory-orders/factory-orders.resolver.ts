import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FactoryOrderStatus } from '@prisma/client';
import { FactoryOrder } from './entity/factory-order.entity';
import { FactoryOrderService } from './factory-orders.service';
import { CurrentUser, GraphqlJwtAuthGuard } from 'src/auth';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/users';
import { MarkAsDelayedDto } from './dto/mark-as-delayed.dto';
import { UpdateOrderDetailStatusDto } from './dto/update-order-detail-status.dto';

@Resolver(() => FactoryOrder)
@UseGuards(GraphqlJwtAuthGuard)
export class FactoryOrderResolver {
  constructor(private readonly factoryOrderService: FactoryOrderService) {}

  @Query(() => [FactoryOrder])
  async factoryOrders() {
    return this.factoryOrderService.findAll();
  }

  @Query(() => FactoryOrder)
  async factoryOrder(@Args('id', { type: () => ID }) id: string) {
    return this.factoryOrderService.findOne(id);
  }

  @Query(() => [FactoryOrder])
  async factoryOrdersByFactory(
    @CurrentUser() user: UserEntity
  ) {
    console.log(user.id)
    return this.factoryOrderService.findByFactory(user.id);
  }

  @Query(() => [FactoryOrder])
  async factoryOrdersByCustomerOrder(
    @Args('customerOrderId', { type: () => ID }) customerOrderId: string
  ) {
    return this.factoryOrderService.findByCustomerOrder(customerOrderId);
  }

  @Mutation(() => FactoryOrder)
  async updateFactoryOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => String }) status: FactoryOrderStatus
  ) {
    return this.factoryOrderService.updateStatus(id, status);
  }

  @Mutation(() => FactoryOrder)
  async markFactoryOrderAsDelayed(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: MarkAsDelayedDto
  ) {
    return this.factoryOrderService.markAsDelayed(id, input);
  }

  @Mutation(() => FactoryOrder)
  async markOnDoneProduction(
    @Args('id', { type: () => ID }) id: string
  ) {
    return this.factoryOrderService.markOnDoneProduction(id);
  }

  @Mutation(() => FactoryOrder)
  async updateFactoryOrderDetailStatus(
    @Args('input') input: UpdateOrderDetailStatusDto
  ) {
    return this.factoryOrderService.updateOrderDetailStatus(input);
  }
}