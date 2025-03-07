import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsOptional, IsString } from "class-validator"

export class ConnectSystemConfigBankDto {
    @ApiProperty({
        type: "integer",
        format: "int32",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsInt()
    id?: number
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    code?: string
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    bin?: string
}
