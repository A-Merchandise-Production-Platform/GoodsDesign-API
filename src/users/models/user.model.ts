import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean)
  gender: boolean;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Boolean)
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  updatedBy?: string;

  @Field(() => String, { nullable: true })
  deletedBy?: string;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => String)
  role: Roles;
}