import { Field, Float, ObjectType } from "@nestjs/graphql"

@ObjectType()
class FactoryScores {
    @Field(() => Float)
    capacityScore: number

    @Field(() => Float)
    leadTimeScore: number

    @Field(() => Float)
    specializationScore: number

    @Field(() => Float)
    legitPointScore: number

    @Field(() => Float)
    productionCapacityScore: number
}

@ObjectType()
class FactoryScoreWeights {
    @Field(() => Float)
    capacity: number

    @Field(() => Float)
    leadTime: number

    @Field(() => Float)
    specialization: number

    @Field(() => Float)
    legitPoint: number

    @Field(() => Float)
    productionCapacity: number
}

@ObjectType()
export class FactoryScoreResponse {
    @Field()
    factoryId: string

    @Field()
    factoryName: string

    @Field(() => FactoryScores)
    scores: FactoryScores

    @Field(() => FactoryScoreWeights)
    weights: FactoryScoreWeights

    @Field(() => Float)
    totalScore: number
} 