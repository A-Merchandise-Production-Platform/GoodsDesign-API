import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSystemConfigBankDto } from './create-system-config-bank.dto';

@InputType()
export class UpdateSystemConfigBankDto extends PartialType(CreateSystemConfigBankDto) {
  @Field(() => ID)
  id: string;
} 