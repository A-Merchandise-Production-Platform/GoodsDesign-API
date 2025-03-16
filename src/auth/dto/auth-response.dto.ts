import { ApiProperty } from "@nestjs/swagger"
import { UserEntity } from "src/users/entities/users.entity"

export class AuthResponseDto {
    @ApiProperty({
        description: "The authenticated user",
        type: UserEntity
    })
    user: UserEntity

    @ApiProperty({
        description: "JWT access token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    })
    accessToken: string

    @ApiProperty({
        description: "JWT refresh token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    })
    refreshToken: string

    constructor(user: UserEntity, accessToken: string, refreshToken: string) {
        this.user = user
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}
