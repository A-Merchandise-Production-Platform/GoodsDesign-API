import { ObjectType, Field, ID } from "@nestjs/graphql"
import { UserEntity } from "src/users/entities/users.entity"
import { VoucherEntity } from "./voucher.entity"

@ObjectType()
export class VoucherUsageEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    voucherId: string

    @Field(() => String)
    userId: string

    @Field(() => String)
    orderId: string

    @Field(() => Date)
    usedAt: Date

    @Field(() => VoucherEntity)
    voucher: VoucherEntity

    @Field(() => UserEntity)
    user: UserEntity

    constructor(partial: Partial<VoucherUsageEntity>) {
        Object.assign(this, partial)
    }
}
