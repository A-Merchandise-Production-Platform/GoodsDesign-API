import { Args, Int, Query, Mutation, Resolver } from '@nestjs/graphql';
import { GetAvailableServicesDto } from './dto/get-available-services.dto';
import { CalculateShippingFeeDto } from './dto/calculate-shipping-fee.dto';
import { CalculateShippingCostAndFactoryDto } from './dto/calculate-shipping-cost-and-factory.dto';
import { District, Province, ShippingService as ShippingServiceModel, Ward, ShippingFee, ShippingOrder } from './models/shipping.model';
import { ShippingCostAndFactoryResponse } from './models/shipping-cost-and-factory.model';
import { ShippingService } from './shipping.service';
import { OrderInfoDto } from './dto/order-info.dto';

@Resolver()
export class ShippingResolver {
  constructor(private readonly shippingService: ShippingService) {}

  @Query(() => [Province])
  async provinces() {
    return this.shippingService.getProvinces();
  }

  //Get a province by id
  @Query(() => Province)
  async province(@Args('provinceId', { type: () => Int }) provinceId: number) {
    return this.shippingService.getProvince(provinceId);
  }

  @Query(() => [District])
  async districts(@Args('provinceId', { type: () => Int }) provinceId: number) {
    return this.shippingService.getDistricts(provinceId);
  }

  //Get a district by id
  @Query(() => District)
  async district(@Args('districtId', { type: () => Int }) districtId: number) {
    return this.shippingService.getDistrict(districtId);
  }

  @Query(() => [Ward])
  async wards(@Args('districtId', { type: () => Int }) districtId: number) {
    return this.shippingService.getWards(districtId);
  }

  //Get a ward by id
  @Query(() => Ward)
  async ward(@Args('wardCode', { type: () => String }) wardCode: string) {
    return this.shippingService.getWard(wardCode);
  }

  @Query(() => [ShippingServiceModel])
  async availableServices(
    @Args('servicesInput') servicesInput: GetAvailableServicesDto,
  ) {
    return this.shippingService.getAvailableServices(
      servicesInput.fromDistrict,
      servicesInput.toDistrict,
    );
  }

  @Mutation(() => ShippingFee)
  async calculateShippingFee(
    @Args('input') input: CalculateShippingFeeDto,
  ) {
    return this.shippingService.calculateShippingFee(input);
  }

  @Mutation(() => ShippingOrder)
  async createShippingOrder(@Args('orderId', { type: () => String }) orderId: string) {
    return this.shippingService.createShippingOrder(orderId);
  }

  @Mutation(() => ShippingCostAndFactoryResponse)
  async calculateShippingCostAndFactoryForCart(
    @Args('input') input: CalculateShippingCostAndFactoryDto,
  ) {
    return this.shippingService.calculateShippingCostAndFactoryForCart(
      input.cartIds,
      input.addressId,
    );
  }

  @Query(() => OrderInfoDto, { name: "getGiaoHangNhanhOrderInfo" })
  async getGiaoHangNhanhOrderInfo(@Args('orderCode', { type: () => String }) orderCode: string) {
    return this.shippingService.getOrderInfo(orderCode);
  }
} 