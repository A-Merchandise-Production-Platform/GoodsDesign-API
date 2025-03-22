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
  async ward(@Args('wardId', { type: () => String }) wardId: string) {
    return this.shippingService.getWard(wardId);
  }

  @Query(() => [ShippingServiceModel])
  async availableServices(
    @Args('fromDistrict', { type: () => Int }) fromDistrict: number,
    @Args('toDistrict', { type: () => Int }) toDistrict: number,
  ) {
    return this.shippingService.getAvailableServices(fromDistrict, toDistrict);
  }
} 