import { ApiProperty } from "@nestjs/swagger"
import { UserResponseDto } from "src/users"

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
        type: UserResponseDto
    })
    user: UserResponseDto

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial)
    }
}
