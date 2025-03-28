import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProductDesignDto {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  isFinalized?: boolean;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  isTemplate?: boolean;
} 