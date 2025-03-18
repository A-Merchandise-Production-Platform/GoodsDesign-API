import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSystemConfigColorDto } from './create-system-config-color.dto';

@InputType()
export class UpdateSystemConfigColorDto extends PartialType(CreateSystemConfigColorDto) {
  @Field(() => ID)
  id: string;
} 