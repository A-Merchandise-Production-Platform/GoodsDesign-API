import { ApiProperty } from "@nestjs/swagger"

export class AddressDto {
    @ApiProperty({
        type: "string"
    })
    id: string
    @ApiProperty({
        type: "integer",
        format: "int32"
    })
    provinceID: number
    @ApiProperty({
        type: "integer",
        format: "int32"
    })
    districtID: number
    @ApiProperty({
        type: "string"
    })
    wardCode: string
    @ApiProperty({
        type: "string"
    })
    street: string
}
