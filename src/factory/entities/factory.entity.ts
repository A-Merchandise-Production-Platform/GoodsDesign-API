import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { FactoryStatus } from "@prisma/client"
import { ProductEntity } from "src/products/entities/products.entity"
import { UserEntity } from "src/users/entities/users.entity"

registerEnumType(FactoryStatus, {
    name: "FactoryStatus"
})

@ObjectType()
export class FactoryEntity {
    @Field(() => String)
    name: string

    @Field(() => String, { nullable: true })
    description: string

    @Field(() => String, { nullable: true })
    businessLicenseUrl: string

    @Field(() => String, { nullable: true })
    taxIdentificationNumber: string

    @Field(() => String, { nullable: true })
    addressId: string

    @Field(() => String, { nullable: true })
    website: string

    @Field(() => Date, { nullable: true })
    establishedDate: Date

    @Field(() => Int, { nullable: true })
    totalEmployees: number

    @Field(() => Int, { nullable: true })
    maxPrintingCapacity: number

    @Field(() => String, { nullable: true })
    qualityCertifications: string

    @Field(() => [String])
    printingMethods: string[]

    @Field(() => [String])
    specializations: string[]

    @Field(() => String, { nullable: true })
    contactPersonName: string

    @Field(() => String, { nullable: true })
    contactPersonRole: string

    @Field(() => String, { nullable: true })
    contactPersonPhone: string

    @Field(() => String, { nullable: true })
    operationalHours: string

    @Field(() => Int, { nullable: true })
    leadTime: number

    @Field(() => Int, { nullable: true })
    minimumOrderQuantity: number

    @Field(() => FactoryStatus, { nullable: true })
    factoryStatus: FactoryStatus

    @Field(() => Boolean, { nullable: true })
    isSubmitted: boolean

    @Field(() => String, { nullable: true })
    statusNote: string

    @Field(() => Boolean, { nullable: true })
    contractAccepted: boolean

    @Field(() => Date, { nullable: true })
    contractAcceptedAt: Date

    @Field(() => String, { nullable: true })
    reviewedBy: string

    @Field(() => Date, { nullable: true })
    reviewedAt: Date

    @Field(() => String, { nullable: true })
    contractUrl: string

    @Field(() => UserEntity)
    owner: UserEntity

    @Field(() => [ProductEntity])
    products: ProductEntity[]

    // @Field(() => [FactoryOrderEntity])
    // orders: FactoryOrderEntity[]

    constructor(partial: Partial<FactoryEntity>) {
        Object.assign(this, partial)
    }
}
