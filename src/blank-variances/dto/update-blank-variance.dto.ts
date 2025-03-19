import { InputType, PartialType } from "@nestjs/graphql"
import { CreateBlankVarianceDto } from "./create-blank-variance.dto"

@InputType({ description: "Update Blank Variance" })
export class UpdateBlankVarianceDto extends PartialType(CreateBlankVarianceDto) {}
