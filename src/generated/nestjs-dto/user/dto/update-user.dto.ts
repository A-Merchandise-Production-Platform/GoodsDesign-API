import { Roles } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @ApiProperty({
        type: "string",
        required: false
    })
    @IsOptional()
    @IsString()
    email?: string
    @ApiProperty({
        type: "string",
        format: "date-time",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: Date | null
    @ApiProperty({
        type: "string",
        default: "",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    imageUrl?: string | null
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    createdBy?: string | null
    @ApiProperty({
        type: "string",
        format: "date-time",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsDateString()
    updatedAt?: Date | null
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    updatedBy?: string | null
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    deletedBy?: string | null
    @ApiProperty({
        type: "string",
        format: "date-time",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsDateString()
    deletedAt?: Date | null
    @ApiProperty({
        enum: Roles,
        enumName: "Roles",
        required: false
    })
    @IsOptional()
    role?: Roles
}
