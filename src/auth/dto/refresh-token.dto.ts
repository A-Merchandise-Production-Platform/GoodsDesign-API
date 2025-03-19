import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString } from "class-validator"

@InputType({ description: "Refresh token input" })
export class RefreshTokenDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    refreshToken: string
}
