import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductEntity } from 'src/products/entities/products.entity';

@ObjectType()
export class SystemConfigVariant {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  price?: number

  @Field()
  isActive: boolean;

  @Field()
  isDeleted: boolean;

  @Field(() => ProductEntity)
  product?: ProductEntity;

} 