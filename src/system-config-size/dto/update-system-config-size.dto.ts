import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSystemConfigSizeDto } from './create-system-config-size.dto';

@InputType()
export class UpdateSystemConfigSizeDto extends PartialType(CreateSystemConfigSizeDto) {
  @Field(() => ID)
  id: string;
} 