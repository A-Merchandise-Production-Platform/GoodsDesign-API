import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Province {
  @Field(() => Int)
  provinceId: number;

  @Field()
  provinceName: string;
}

@ObjectType()
export class District {
  @Field(() => Int)
  districtId: number;

  @Field(() => Int)
  provinceId: number;

  @Field()
  districtName: string;
}

@ObjectType()
export class Ward {
  @Field()
  wardCode: string;

  @Field(() => Int)
  districtId: number;

  @Field()
  wardName: string;
}

@ObjectType()
export class ShippingService {
  @Field(() => Int)
  serviceId: number;

  @Field()
  shortName: string;

  @Field(() => Int)
  serviceTypeId: number;
}

@ObjectType()
export class ShippingFee {
  @Field(() => Int)
  total: number;

  // @Field(() => Int)
  // serviceId: number;

  // @Field(() => String)
  // serviceName: string;
}

@ObjectType()
export class ShippingOrderFee {
  @Field(() => Int, { nullable: true })
  coupon: number;

  @Field(() => Int, { nullable: true })
  insurance: number;

  @Field(() => Int, { nullable: true })
  main_service: number;

  @Field(() => Int, { nullable: true })
  r2s: number;

  @Field(() => Int, { nullable: true })
  return: number;

  @Field(() => Int, { nullable: true })
  station_do: number;

  @Field(() => Int, { nullable: true })
  station_pu: number;
}

@ObjectType()
export class ShippingOrder {
  @Field(() => String, { nullable: true })
  orderCode?: string;

  @Field(() => String, { nullable: true })
  sortCode?: string;

  @Field(() => String, { nullable: true })
  transType?: string;

  @Field(() => String, { nullable: true })
  wardEncode?: string;

  @Field(() => String, { nullable: true })
  districtEncode?: string;

  @Field(() => String, { nullable: true })
  expectedDeliveryTime?: string;

  @Field(() => String, { nullable: true })
  totalFee?: string;
  @Field(() => ShippingOrderFee, { nullable: true })
  fee?: ShippingOrderFee;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  code?: number;
}