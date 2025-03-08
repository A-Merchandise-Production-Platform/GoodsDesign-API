import { ApiProperty, PartialType } from "@nestjs/swagger"
import { CreateUserDto } from "./create-user.dto"
import { IsString, IsOptional } from "class-validator"

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ description: "Updated by user ID", required: false })
    @IsString()
    @IsOptional()
    updatedBy?: string
}
