import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CustomerOrdersService } from './customer-orders.service';
import { CustomerOrder } from './models/customer-order.model';
import { CreateCustomerOrderInput, UpdateCustomerOrderInput, CustomerOrderFilterInput } from './dto/customer-order.input';

@Resolver(() => CustomerOrder)
export class CustomerOrdersResolver {
  constructor(private readonly customerOrdersService: CustomerOrdersService) {}

  @Mutation(() => CustomerOrder)
  async createCustomerOrder(
    @Args('input') input: CreateCustomerOrderInput,
  ) {
    return this.customerOrdersService.create(input);
  }

  @Query(() => [CustomerOrder])
  async customerOrders(
    @Args('filter', { nullable: true }) filter?: CustomerOrderFilterInput,
  ) {
    return this.customerOrdersService.findAll(filter);
  }

  @Query(() => CustomerOrder)
  async customerOrder(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.customerOrdersService.findOne(id);
  }

  @Mutation(() => CustomerOrder)
  async updateCustomerOrder(
    @Args('input') input: UpdateCustomerOrderInput,
  ) {
    return this.customerOrdersService.update(input);
  }

  @Mutation(() => CustomerOrder)
  async removeCustomerOrder(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.customerOrdersService.remove(id);
  }
} 