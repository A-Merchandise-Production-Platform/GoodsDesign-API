import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ConnectProductDto {
    @ApiProperty({
        type: "string"
    })
    @IsNotEmpty()
    @IsString()
    id: string
}
