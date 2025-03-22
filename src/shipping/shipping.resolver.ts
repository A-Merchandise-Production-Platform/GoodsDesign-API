import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ShippingService } from './shipping.service';
import { Province, District, Ward, ShippingService as ShippingServiceModel } from './models/shipping.model';

@Resolver()
export class ShippingResolver {
  constructor(private readonly shippingService: ShippingService) {}

  @Query(() => [Province])
  async provinces() {
    return this.shippingService.getProvinces();
  }

  @Query(() => [District])
  async districts(@Args('provinceId', { type: () => Int }) provinceId: number) {
    return this.shippingService.getDistricts(provinceId);
  }

  @Query(() => [Ward])
  async wards(@Args('districtId', { type: () => Int }) districtId: number) {
    return this.shippingService.getWards(districtId);
  }

  @Query(() => [ShippingServiceModel])
  async availableServices(
    @Args('fromDistrict', { type: () => Int }) fromDistrict: number,
    @Args('toDistrict', { type: () => Int }) toDistrict: number,
  ) {
    return this.shippingService.getAvailableServices(fromDistrict, toDistrict);
  }
} 