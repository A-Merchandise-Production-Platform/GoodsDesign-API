import { Field, ObjectType } from '@nestjs/graphql';
import { FactoryEntity } from '@/factory/entities/factory.entity';
import { ShippingFee } from './shipping.model';

@ObjectType()
export class ShippingCostAndFactoryResponse {
  @Field(() => ShippingFee)
  shippingFee: ShippingFee;

  @Field(() => FactoryEntity, { nullable: true })
  selectedFactory: FactoryEntity | null;
} 