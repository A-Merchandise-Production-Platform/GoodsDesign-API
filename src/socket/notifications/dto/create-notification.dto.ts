import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationDto {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ defaultValue: false })
  isRead?: boolean;

  @Field()
  userId: string;
} 