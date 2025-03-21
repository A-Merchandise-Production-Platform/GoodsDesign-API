import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString, IsBoolean } from "class-validator"
@InputType()
export class CreateSystemConfigSizeDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string

    @Field()
    @IsNotEmpty()
    @IsString()
    code: string

    @Field({ defaultValue: true })
    @IsNotEmpty()
    @IsBoolean()
    isActive?: boolean
}
