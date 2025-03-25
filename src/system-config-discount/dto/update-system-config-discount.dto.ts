import { CreateSystemConfigDiscountDto } from "./create-system-config-discount.dto"
import { InputType, PartialType } from "@nestjs/graphql"

@InputType()
export class UpdateSystemConfigDiscountDto extends PartialType(CreateSystemConfigDiscountDto) {}
