import { Roles } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"
import { Address } from "../../address/entities/address.entity"
import { Exclude } from "class-transformer"

export class User {
    @ApiProperty({
        type: "string"
    })
    id: string
    @ApiProperty({
        type: "string"
    })
    email: string

    @Exclude()
    password: string
    @ApiProperty({
        type: "boolean"
    })
    gender: boolean
    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true
    })
    dateOfBirth: Date | null
    @ApiProperty({
        type: "string",
        nullable: true
    })
    imageUrl: string | null
    @ApiProperty({
        type: "boolean"
    })
    isActive: boolean

    isDeleted: boolean
    @ApiProperty({
        type: "string",
        format: "date-time"
    })
    createdAt: Date

    createdBy: string | null
    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true
    })
    updatedAt: Date | null

    updatedBy: string | null

    deletedBy: string | null
    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true
    })
    deletedAt: Date | null
    @ApiProperty({
        enum: Roles,
        enumName: "Roles"
    })
    role: Roles

    @Exclude()
    addresses?: Address[]

    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}
