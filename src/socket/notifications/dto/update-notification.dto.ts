import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateNotificationDto } from './create-notification.dto';

@InputType()
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @Field(() => ID)
  id: string;
} 