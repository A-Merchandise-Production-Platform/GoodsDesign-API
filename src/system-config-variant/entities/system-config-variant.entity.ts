import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BlankVariancesEntity } from 'src/blank-variances';
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

  @Field()
  isActive: boolean;

  @Field()
  isDeleted: boolean;

  @Field(() => ProductEntity)
  product?: ProductEntity;

  @Field(() => [BlankVariancesEntity])
  blankVariances?: BlankVariancesEntity[];
} 