import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateSystemConfigColorDto {
    @ApiProperty({
        type: "string"
    })
    @IsNotEmpty()
    @IsString()
    name: string
    @ApiProperty({
        type: "string"
    })
    @IsNotEmpty()
    @IsString()
    code: string
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
        format: "date-time",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsDateString()
    deletedAt?: Date | null
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    deletedBy?: string | null
}
