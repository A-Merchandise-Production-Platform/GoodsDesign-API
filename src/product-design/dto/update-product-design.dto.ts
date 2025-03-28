import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateProductDesignDto } from './create-product-design.dto';

@InputType()
export class UpdateProductDesignDto extends PartialType(CreateProductDesignDto) {}
