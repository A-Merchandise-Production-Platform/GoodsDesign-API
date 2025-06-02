import { Field, ID, ObjectType } from "@nestjs/graphql"
import { EvaluationCriteriaEntity } from "../../evaluation-criteria/entities/evaluation-criteria.entity"

@ObjectType()
export class CheckQualityFailedEvaluationCriteriaEntity {
    @Field(() => ID)
    id: string

    @Field(() => ID)
    checkQualityId: string

    @Field(() => ID)
    evaluationCriteriaId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => EvaluationCriteriaEntity)
    evaluationCriteria: EvaluationCriteriaEntity

    constructor(partial: Partial<CheckQualityFailedEvaluationCriteriaEntity>) {
        Object.assign(this, partial)
    }
}
