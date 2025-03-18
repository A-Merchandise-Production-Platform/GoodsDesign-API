import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../users/entities/users.entity';
import { BlankVariancesEntity } from '../../blank-variances/entities/blank-variances.entity';
import { DesignPositionEntity } from '../../design-position/entities/design-position.entity';

@ObjectType()
export class ProductDesignEntity {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  blankVariantId: string;

  @Field()
  saved3DPreviewUrl: string;

  @Field()
  isFinalized: boolean;

  @Field()
  createdAt: Date;

  @Field()
  isPublic: boolean;

  @Field()
  isTemplate: boolean;

  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;

  @Field(() => BlankVariancesEntity, { nullable: true })
  blankVariant?: BlankVariancesEntity;

  // @Field(() => [FavoriteDesignEntity], { nullable: true })
  // favorites?: FavoriteDesignEntity[];

  @Field(() => [DesignPositionEntity], { nullable: true })
  designPositions?: DesignPositionEntity[];

  // @Field(() => [CustomerOrderDetailEntity], { nullable: true })
  // orderDetails?: CustomerOrderDetailEntity[];

  // @Field(() => [FactoryOrderDetailEntity], { nullable: true })
  // factoryOrderDetails?: FactoryOrderDetailEntity[];
} 