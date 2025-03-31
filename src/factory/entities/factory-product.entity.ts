import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FactoryProductEntity {
    @Field(() => String)
    id: string;

    @Field(() => String)
    factoryId: string;

    @Field(() => String)
    systemConfigVariantId: string;

    @Field(() => Int)
    productionCapacity: number;

    @Field(() => Int)
    estimatedProductionTime: number;

    constructor(partial: Partial<FactoryProductEntity>) {
        Object.assign(this, partial);
    }
}