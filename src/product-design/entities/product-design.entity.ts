import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DesignPositionEntity } from '../../design-position/entities/design-position.entity';
import { UserEntity } from 'src/users/entities/users.entity';

@ObjectType()
export class ProductDesignEntity {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  systemConfigVariantId: string;

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

  @Field(() => [DesignPositionEntity], { nullable: true })
  designPositions?: DesignPositionEntity[];

  constructor(partial: Partial<ProductDesignEntity>) {
    Object.assign(this, partial);
}
} 