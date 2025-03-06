import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

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

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => String, { nullable: true })
  deletedBy?: string;
}