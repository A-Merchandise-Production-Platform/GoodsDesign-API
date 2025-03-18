import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SystemConfigSizeEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  isActive: boolean;

  @Field()
  isDeleted: boolean;
} 