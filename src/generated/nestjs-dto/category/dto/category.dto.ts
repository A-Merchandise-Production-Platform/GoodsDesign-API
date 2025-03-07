import { ApiProperty } from "@nestjs/swagger"

export class CategoryDto {
    @ApiProperty({
        type: "string"
    })
    id: string
    @ApiProperty({
        type: "string"
    })
    name: string
    @ApiProperty({
        type: "string",
        nullable: true
    })
    description: string | null
    @ApiProperty({
        type: "string",
        nullable: true
    })
    imageUrl: string | null
    @ApiProperty({
        type: "boolean"
    })
    isActive: boolean
    @ApiProperty({
        type: "boolean"
    })
    isDeleted: boolean
    @ApiProperty({
        type: "string",
        format: "date-time"
    })
    createdAt: Date
    @ApiProperty({
        type: "string",
        nullable: true
    })
    createdBy: string | null
    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true
    })
    updatedAt: Date | null
    @ApiProperty({
        type: "string",
        nullable: true
    })
    updatedBy: string | null
    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true
    })
    deletedAt: Date | null
    @ApiProperty({
        type: "string",
        nullable: true
    })
    deletedBy: string | null
}
