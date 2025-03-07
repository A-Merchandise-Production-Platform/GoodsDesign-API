import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../user/entities/user.entity"

export class Address {
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
    @ApiProperty({
        type: "string"
    })
    userId: string
    @ApiProperty({
        type: () => User,
        required: false
    })
    user?: User
}
