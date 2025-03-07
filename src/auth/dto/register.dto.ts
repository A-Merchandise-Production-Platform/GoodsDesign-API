import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class RegisterDto {
    @ApiProperty({ description: "User email", example: "user@example.com" })
    @IsEmail()
    email: string

    @ApiProperty({ description: "User password", example: "strongPassword123" })
    @IsString()
    @MinLength(6)
    password: string
}
