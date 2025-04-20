import { ObjectType, Field, ID } from "@nestjs/graphql"
import { SystemConfigBankEntity } from "src/system-config-bank/entities/system-config-bank.entity"
import { UserEntity } from "src/users"

@ObjectType()
export class UserBankEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    userId: string

    @Field(() => String)
    bankId: string

    @Field(() => String)
    accountNumber: string

    @Field(() => String)
    accountName: string

    @Field(() => Boolean)
    isDefault: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date

    @Field(() => UserEntity, { nullable: true })
    user?: UserEntity

    @Field(() => SystemConfigBankEntity, { nullable: true })
    bank?: SystemConfigBankEntity

    constructor(partial: Partial<UserBankEntity>) {
        Object.assign(this, partial)
    }
} 