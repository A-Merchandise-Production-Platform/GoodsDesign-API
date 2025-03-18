import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSystemConfigColorDto {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field({ defaultValue: true })
  isActive?: boolean;
} 