import { Field, ID, ObjectType } from "@nestjs/graphql"
import { EvaluationCriteriaEntity } from "../../evaluation-criteria/entities/evaluation-criteria.entity"

@ObjectType()
export class OrderEvaluationCriteriaEntity {
    @Field(() => ID)
    id: string

    @Field(() => ID)
    orderId: string

    @Field(() => ID)
    evaluationCriteriaId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => EvaluationCriteriaEntity)
    evaluationCriteria: EvaluationCriteriaEntity
} 