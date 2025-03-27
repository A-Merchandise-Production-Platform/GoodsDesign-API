import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ProductEntity } from 'src/products/entities/products.entity';

@ObjectType()
export class SystemConfigVariant {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLJSONObject)
  value: any;

  @Field()
  productId: string;

  @Field()
  isActive: boolean;

  @Field()
  isDeleted: boolean;

  @Field(() => ProductEntity, { nullable: true })
  product?: ProductEntity;
} 