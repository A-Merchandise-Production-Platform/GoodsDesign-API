import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UserStats {
    @Field(() => Int)
    totalUsers: number

    @Field(() => Int)
    activeUsers: number

    @Field(() => Int)
    newUsersLast30Days: number
}

@ObjectType()
export class MonthlyUserGrowth {
    @Field(() => String)
    month: string

    @Field(() => Int)
    users: number
}

@ObjectType()
export class RoleDistribution {
    @Field(() => String)
    role: string

    @Field(() => Int)
    count: number
}

@ObjectType()
export class UserAnalytics {
    @Field(() => UserStats)
    stats: UserStats

    @Field(() => [MonthlyUserGrowth])
    monthlyGrowth: MonthlyUserGrowth[]

    @Field(() => [RoleDistribution])
    roleDistribution: RoleDistribution[]
}
