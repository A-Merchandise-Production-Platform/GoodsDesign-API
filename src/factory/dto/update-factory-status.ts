import { Field, InputType, registerEnumType } from "@nestjs/graphql"
import { FactoryStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

registerEnumType(FactoryStatus, {
    name: "FactoryStatus",
    description: "The status of the factory"
})

@InputType()
export class UpdateFactoryStatusDto {
    @Field(() => FactoryStatus)
    @IsNotEmpty()
    @IsEnum(FactoryStatus)
    status: FactoryStatus

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    factoryOwnerId: string

    @Field(() => String)
    @IsString()
    staffId: string
}
