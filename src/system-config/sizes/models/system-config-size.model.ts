import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SystemConfigSize {
  @Field()
  id: string;

  @Field()
  code: string;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedBy?: string;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  deletedBy?: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  isDeleted: boolean;

  @Field({ nullable: true })
  isActive?: boolean;
}