import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSystemConfigSizeDto {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field({ defaultValue: true })
  isActive?: boolean;
} 