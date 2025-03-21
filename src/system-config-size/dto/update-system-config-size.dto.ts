import { Field, ID, InputType, PartialType } from "@nestjs/graphql"
import { CreateSystemConfigSizeDto } from "./create-system-config-size.dto"
import { IsNotEmpty, IsString } from "class-validator"
@InputType()
export class UpdateSystemConfigSizeDto extends PartialType(CreateSystemConfigSizeDto) {
    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    id: string
}
