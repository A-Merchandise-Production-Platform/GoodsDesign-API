import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ProductDesignEntity } from '../../product-design/entities/product-design.entity';
import { ProductPositionTypeEntity } from '../../product-position-type/entities/product-position-type.entity';
import { JsonValue } from '@prisma/client/runtime/library';

@ObjectType()
export class DesignPositionEntity {
  @Field(() => ID)
  id: string;

  @Field()
  designId: string;

  @Field()
  productPositionTypeId: string;

  @Field(() => GraphQLJSON)
  designJSON: JsonValue

  @Field(() => ProductDesignEntity, { nullable: true })
  design?: ProductDesignEntity;

  @Field(() => ProductPositionTypeEntity, { nullable: true })
  positionType?: ProductPositionTypeEntity;
} 