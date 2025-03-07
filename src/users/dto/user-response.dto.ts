import { ApiHideProperty, ApiProperty } from "@nestjs/swagger"
import { Roles } from "@prisma/client"
import { Exclude } from "class-transformer"

export class UserResponseDto {
    @ApiProperty({ description: "User ID" })
    id: string

    @ApiProperty({ description: "User email" })
    email: string

    @ApiProperty({ description: "User name" })
    name: string

    @ApiProperty({ description: "User phone number" })
    phoneNumber: string

    @Exclude()
    @ApiHideProperty()
    password: string

    @ApiProperty({ description: "User gender" })
    gender: boolean

    @ApiProperty({ description: "User date of birth" })
    dateOfBirth?: Date

    @ApiProperty({ description: "User image URL" })
    imageUrl?: string

    @ApiProperty({ description: "User active status" })
    isActive: boolean

    @ApiProperty({ description: "User deletion status" })
    isDeleted: boolean

    @ApiProperty({ description: "User role", default: Roles.CUSTOMER })
    role: Roles

    @ApiProperty({ description: "Creation timestamp" })
    createdAt: Date

    @ApiProperty({ description: "Created by user ID" })
    createdBy?: string

    @ApiProperty({ description: "Last update timestamp" })
    updatedAt?: Date

    @ApiProperty({ description: "Updated by user ID" })
    updatedBy?: string

    @Exclude()
    @ApiHideProperty()
    deletedAt?: Date

    @Exclude()
    @ApiHideProperty()
    deletedBy?: string

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial)
    }
}
