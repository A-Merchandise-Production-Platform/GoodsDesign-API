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