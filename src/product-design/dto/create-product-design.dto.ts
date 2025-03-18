import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductDesignDto {
  @Field()
  userId: string;

  @Field()
  blankVariantId: string;

  @Field()
  saved3DPreviewUrl: string;

  @Field({ defaultValue: false })
  isFinalized?: boolean;

  @Field({ defaultValue: false })
  isPublic?: boolean;

  @Field({ defaultValue: false })
  isTemplate?: boolean;
} 