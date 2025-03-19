import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ProductEntity } from '../../products/entities/products.entity';

@ObjectType()
export class ProductPositionTypeEntity {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field()
  positionName: string;

  @Field(() => Int)
  basePrice: number;

  @Field(() => ProductEntity, { nullable: true })
  product?: ProductEntity;

  @Field(() => [ProductPositionTypeEntity], { nullable: true })
  positionTypes?: ProductPositionTypeEntity[];
} 