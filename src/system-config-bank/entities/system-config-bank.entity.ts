import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SystemConfigBankEntity {
  @Field(() => ID)
  id: string;

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

  @Field()
  isActive: boolean;

  @Field()
  isDeleted: boolean;
} 