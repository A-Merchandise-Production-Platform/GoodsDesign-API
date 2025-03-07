import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthDto {
    @ApiProperty({ description: "User email", example: "admin@example.com" })
    @IsEmail()
    email: string

    @ApiProperty({ description: "User password", example: "123456" })
    @IsString()
    @MinLength(6)
    password: string
}
