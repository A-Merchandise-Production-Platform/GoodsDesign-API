import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DesignPositionEntity } from '../../design-position/entities/design-position.entity';
import { UserEntity } from 'src/users/entities/users.entity';
import { BlankVariancesEntity } from 'src/blank-variances/entities/blank-variances.entity';

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

  @Field(() => [DesignPositionEntity], { nullable: true })
  designPositions?: DesignPositionEntity[];
} 