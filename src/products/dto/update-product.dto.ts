import { InputType, PartialType } from "@nestjs/graphql"
import { CreateProductDto } from "./create-product.dto"

@InputType({ description: "Update Product" })
export class UpdateProductDto extends PartialType(CreateProductDto) {}
