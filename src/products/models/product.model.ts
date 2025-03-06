import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Category } from '../../categories/models/category.model';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  model3DUrl?: string;

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

  @Field(() => String)
  categoryId: string;

  @Field(() => Category, { nullable: true })
  category?: Category;
}