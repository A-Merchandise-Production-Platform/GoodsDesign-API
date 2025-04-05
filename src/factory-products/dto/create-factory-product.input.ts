import { InputType, Int, Field } from "@nestjs/graphql"

@InputType()
export class CreateFactoryProductInput {
    @Field(() => String)
    factoryId: string

    @Field(() => String)
    systemConfigVariantId: string

    @Field(() => Int)
    productionCapacity: number

    @Field(() => Int)
    estimatedProductionTime: number
}
