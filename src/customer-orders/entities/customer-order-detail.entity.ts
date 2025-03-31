import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { IsOptional } from "class-validator"
import { ProductDesignEntity } from "src/product-design/entities/product-design.entity"

@ObjectType()
export class CustomerOrderDetailEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    orderId: string

    @Field(() => String)
    designId: string

    @Field(() => Int)
    price: number

    @Field(() => Int)
    quantity: number

    @Field(() => String)
    status: string

    @Field(() => String)
    qualityCheckStatus: string

    @Field(() => String)
    reworkStatus: string

    @Field(() => ProductDesignEntity, { nullable: true })
    @IsOptional()
    design?: ProductDesignEntity

    constructor(partial: Partial<CustomerOrderDetailEntity>) {
        Object.assign(this, partial)
    }
}
