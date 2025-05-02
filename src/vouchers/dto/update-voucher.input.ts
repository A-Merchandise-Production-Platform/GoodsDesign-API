import { CreateVoucherInput } from "./create-voucher.input"
import { InputType, Field, Int, PartialType } from "@nestjs/graphql"
import { IsNotEmpty, IsString } from "class-validator"

@InputType()
export class UpdateVoucherInput extends PartialType(CreateVoucherInput) {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    id: string
}
