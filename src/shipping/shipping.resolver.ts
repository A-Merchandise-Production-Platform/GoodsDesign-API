import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { GetAvailableServicesDto } from './dto/get-available-services.dto';
import { District, Province, ShippingService as ShippingServiceModel, Ward } from './models/shipping.model';
import { ShippingService } from './shipping.service';

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
} 