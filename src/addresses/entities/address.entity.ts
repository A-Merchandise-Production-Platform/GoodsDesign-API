import { ObjectType, Field, Int } from "@nestjs/graphql"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { UserEntity } from "src/users"

@ObjectType()
export class AddressEntity {
    @Field(() => String)
    id: string

    @Field(() => Number)
    provinceID: number

    @Field(() => Number)
    districtID: number

    @Field(() => String)
    wardCode: string

    @Field(() => String)
    street: string

    @Field(() => String)
    userId: string

    @Field(() => String)
    factoryId: string

    @Field(() => UserEntity, { nullable: true })
    user?: UserEntity

    @Field(() => FactoryEntity, { nullable: true })
    factory?: FactoryEntity

    constructor(partial: Partial<AddressEntity>) {
        Object.assign(this, partial)
    }
}
