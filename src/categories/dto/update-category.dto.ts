import { InputType, PartialType } from "@nestjs/graphql"
import { CreateCategoryDto } from "src/categories/dto/create-category.dto"

@InputType({ description: "Update category input" })
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
