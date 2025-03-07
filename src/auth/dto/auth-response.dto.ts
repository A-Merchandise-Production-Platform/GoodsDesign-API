import { ApiProperty } from "@nestjs/swagger"
import { Roles } from "@prisma/client"
import { User } from "src/generated/nestjs-dto"

export class AuthResponseDto {
    @ApiProperty({
        description: "JWT access token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    })
    accessToken: string

    @ApiProperty({
        description: "JWT refresh token for obtaining new access tokens",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    })
    refreshToken: string

    @ApiProperty({
        type: User
    })
    user: User

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial)
    }
}
