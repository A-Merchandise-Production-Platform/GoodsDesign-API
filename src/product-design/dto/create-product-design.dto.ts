import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductDesignDto {
  @Field({ nullable: true })
  userId?: string;

  @Field()
  blankVariantId: string;

  @Field({ defaultValue: false })
  isFinalized?: boolean;

  @Field({ defaultValue: false })
  isPublic?: boolean;

  @Field({ defaultValue: false })
  isTemplate?: boolean;
} 