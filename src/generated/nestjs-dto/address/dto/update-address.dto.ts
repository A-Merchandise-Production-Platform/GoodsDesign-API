import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsOptional, IsString } from "class-validator"

export class UpdateAddressDto {
    @ApiProperty({
        type: "integer",
        format: "int32",
        required: false
    })
    @IsOptional()
    @IsInt()
    provinceID?: number
    @ApiProperty({
        type: "integer",
        format: "int32",
        required: false
    })
    @IsOptional()
    @IsInt()
    districtID?: number
    @ApiProperty({
        type: "string",
        required: false
    })
    @IsOptional()
    @IsString()
    wardCode?: string
    @ApiProperty({
        type: "string",
        required: false
    })
    @IsOptional()
    @IsString()
    street?: string
}
