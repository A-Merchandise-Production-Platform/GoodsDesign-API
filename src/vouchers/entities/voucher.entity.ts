import { ObjectType, Field, Int, Float, registerEnumType } from "@nestjs/graphql"
import { VoucherType } from "@prisma/client"
import { UserEntity } from "src/users/entities/users.entity"
import { VoucherUsageEntity } from "./voucher-usage.entity"

registerEnumType(VoucherType, {
    name: "VoucherType",
    description: "Type of voucher (fixed value or percentage)"
})

@ObjectType()
export class VoucherEntity {
    @Field(() => String)
    id: string

    @Field(() => String)
    code: string

    @Field(() => VoucherType)
    type: VoucherType

    @Field(() => Int)
    value: number

    @Field(() => Int, { nullable: true })
    minOrderValue?: number

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => Boolean)
    isPublic: boolean

    @Field(() => Int, { nullable: true })
    limitedUsage?: number

    @Field(() => Boolean)
    isActive: boolean

    @Field(() => Boolean)
    isDeleted: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    userId?: string

    @Field(() => UserEntity, { nullable: true })
    user?: UserEntity

    @Field(() => [VoucherUsageEntity], { nullable: true })
    usages?: VoucherUsageEntity[]

    constructor(partial: Partial<VoucherEntity>) {
        Object.assign(this, partial)
    }
}
