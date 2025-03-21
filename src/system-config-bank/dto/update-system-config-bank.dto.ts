import { Field, ID, InputType, PartialType } from "@nestjs/graphql"
import { CreateSystemConfigBankDto } from "./create-system-config-bank.dto"
import { IsNotEmpty, IsString } from "class-validator"
@InputType()
export class UpdateSystemConfigBankDto extends PartialType(CreateSystemConfigBankDto) {
    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    id: string
}
