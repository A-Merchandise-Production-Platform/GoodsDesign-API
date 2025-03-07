import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateAddressDto {
    @ApiProperty({
        type: "integer",
        format: "int32"
    })
    @IsNotEmpty()
    @IsInt()
    provinceID: number
    @ApiProperty({
        type: "integer",
        format: "int32"
    })
    @IsNotEmpty()
    @IsInt()
    districtID: number
    @ApiProperty({
        type: "string"
    })
    @IsNotEmpty()
    @IsString()
    wardCode: string
    @ApiProperty({
        type: "string"
    })
    @IsNotEmpty()
    @IsString()
    street: string
}
