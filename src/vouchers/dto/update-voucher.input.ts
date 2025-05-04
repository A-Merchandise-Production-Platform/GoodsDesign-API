import { InputType, PartialType } from "@nestjs/graphql"
import { CreateVoucherInput } from "./create-voucher.input"

@InputType()
export class UpdateVoucherInput extends PartialType(CreateVoucherInput) {}
