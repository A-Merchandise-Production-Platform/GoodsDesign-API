import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSystemConfigBankDto {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  bin: string;

  @Field()
  shortName: string;

  @Field()
  logo: string;

  @Field({ defaultValue: true })
  isActive?: boolean;
} 