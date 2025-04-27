import { ObjectType, Field, Int, Float, registerEnumType } from "@nestjs/graphql"
import { VoucherType } from "@prisma/client"
import { UserEntity } from "src/users/entities/users.entity"

registerEnumType(VoucherType, {
    name: "VoucherType",
    description: "Type of voucher (fixed value or percentage)"
})

@ObjectType()
export class Voucher {
    @Field(() => String)
    id: string

    @Field(() => String)
    code: string

    @Field(() => VoucherType)
    type: VoucherType

    @Field(() => Float)
    value: number

    @Field(() => Int, { nullable: true })
    minOrderValue?: number

    @Field(() => Date)
    startDate: Date

    @Field(() => Date)
    endDate: Date

    @Field(() => Boolean)
    isActive: boolean

    @Field(() => Boolean)
    isDeleted: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => String)
    userId: string

    @Field(() => Date, { nullable: true })
    usedAt?: Date

    @Field(() => UserEntity, { nullable: true })
    user?: UserEntity

    constructor(partial: Partial<Voucher>) {
        Object.assign(this, partial)
    }
}
