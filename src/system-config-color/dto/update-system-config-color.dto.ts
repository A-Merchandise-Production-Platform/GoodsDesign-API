import { Field, ID, InputType, PartialType } from "@nestjs/graphql"
import { CreateSystemConfigColorDto } from "./create-system-config-color.dto"
import { IsNotEmpty, IsString } from "class-validator"
@InputType()
export class UpdateSystemConfigColorDto extends PartialType(CreateSystemConfigColorDto) {
    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    id: string
}
