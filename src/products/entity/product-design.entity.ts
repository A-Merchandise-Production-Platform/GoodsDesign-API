import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../users';
import { SystemConfigVariantEntity } from 'src/system-config-variant/entities/system-config-variant.entity';

@ObjectType()
export class ProductDesign {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  systemConfigVariantId: string;

  @Field(() => Boolean)
  isFinalized: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Boolean)
  isPublic: boolean;

  @Field(() => Boolean)
  isTemplate: boolean;

  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => SystemConfigVariantEntity)
  systemConfigVariant: SystemConfigVariantEntity;

} 