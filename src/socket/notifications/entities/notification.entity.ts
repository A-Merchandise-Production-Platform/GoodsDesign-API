import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../../users/entities/users.entity';

@ObjectType()
export class NotificationEntity {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  url?: string;

  @Field()
  isRead: boolean;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;
} 