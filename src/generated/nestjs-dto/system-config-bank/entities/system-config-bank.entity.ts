import { ApiProperty } from "@nestjs/swagger"

export class SystemConfigBank {
    @ApiProperty({
        type: "integer",
        format: "int32"
    })
    id: number
    @ApiProperty({
        type: "string"
    })
    name: string
    @ApiProperty({
        type: "string"
    })
    code: string
    @ApiProperty({
        type: "string"
    })
    bin: string
    @ApiProperty({
        type: "string"
    })
    shortName: string
    @ApiProperty({
        type: "string"
    })
    logo: string
    @ApiProperty({
        type: "boolean"
    })
    transferSupported: boolean
    @ApiProperty({
        type: "boolean"
    })
    lookupSupported: boolean
    @ApiProperty({
        type: "integer",
        format: "int32"
    })
    support: number
    @ApiProperty({
        type: "boolean"
    })
    isTransfer: boolean
    @ApiProperty({
        type: "string",
        nullable: true
    })
    swiftCode: string | null
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
