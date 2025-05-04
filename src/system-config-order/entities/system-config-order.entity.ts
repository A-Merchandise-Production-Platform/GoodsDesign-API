import { Field, ID, ObjectType, Float, Int, registerEnumType } from "@nestjs/graphql"
import { VoucherType } from "@prisma/client"

registerEnumType(VoucherType, {
    name: "VoucherType",
    description: "The type of voucher"
})

@ObjectType()
export class SystemConfigOrderEntity {
    @Field(() => ID)
    id: string

    @Field()
    type: string

    @Field(() => Int)
    limitFactoryRejectOrders: number

    @Field(() => Int)
    checkQualityTimesDays: number

    @Field(() => Int)
    limitReworkTimes: number

    @Field(() => Int)
    shippingDays: number

    @Field(() => Int)
    reduceLegitPointIfReject: number

    @Field(() => Int)
    legitPointToSuspend: number

    @Field(() => Int)
    acceptHoursForFactory: number

    @Field(() => Int)
    maxLegitPoint: number

    @Field(() => Int)
    maxProductionTimeInMinutes: number

    @Field(() => Int)
    maxProductionCapacity: number

    @Field(() => Float)
    capacityScoreWeight: number

    @Field(() => Float)
    leadTimeScoreWeight: number

    @Field(() => Float)
    specializationScoreWeight: number

    @Field(() => Float)
    legitPointScoreWeight: number

    @Field(() => Float)
    productionCapacityScoreWeight: number

    @Field(() => Int)
    voucherBaseValueForRefund: number

    @Field(() => VoucherType)
    voucherBaseTypeForRefund: VoucherType

    constructor(partial: Partial<SystemConfigOrderEntity>) {
        Object.assign(this, partial)
    }
}
