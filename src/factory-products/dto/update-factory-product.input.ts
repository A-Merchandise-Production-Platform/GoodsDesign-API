import { CreateFactoryProductInput } from "./create-factory-product.input"
import { InputType, PartialType } from "@nestjs/graphql"

@InputType()
export class UpdateFactoryProductInput extends PartialType(CreateFactoryProductInput) {}
