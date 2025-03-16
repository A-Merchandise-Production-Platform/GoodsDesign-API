import { ApiProperty } from "@nestjs/swagger"
import { Field, ObjectType } from "@nestjs/graphql"
import { Roles } from "@prisma/client"

@ObjectType()
class UserAnalyticsStats {
    @Field(() => Number)
    @ApiProperty({
        description: "Total number of users",
        example: 100
    })
    totalUsers: number

    @Field(() => Number)
    @ApiProperty({
        description: "Number of active users",
        example: 85
    })
    activeUsers: number

    @Field(() => Number)
    @ApiProperty({
        description: "Number of new users in the last 30 days",
        example: 15
    })
    newUsersLast30Days: number
}

@ObjectType()
class MonthlyGrowth {
    @Field(() => String)
    @ApiProperty({
        description: "Month and year",
        example: "Jan 2024"
    })
    month: string

    @Field(() => Number)
    @ApiProperty({
        description: "Number of new users in this month",
        example: 10
    })
    users: number
}

@ObjectType()
class RoleDistribution {
    @Field(() => Roles)
    @ApiProperty({
        description: "User role",
        enum: Roles
    })
    role: Roles

    @Field(() => Number)
    @ApiProperty({
        description: "Number of users with this role",
        example: 50
    })
    count: number
}

@ObjectType()
export class UserAnalyticsEntity {
    @Field(() => UserAnalyticsStats)
    @ApiProperty({
        description: "Basic user statistics"
    })
    stats: UserAnalyticsStats

    @Field(() => [MonthlyGrowth])
    @ApiProperty({
        description: "Monthly user growth for the last 12 months",
        type: [MonthlyGrowth]
    })
    monthlyGrowth: MonthlyGrowth[]

    @Field(() => [RoleDistribution])
    @ApiProperty({
        description: "Distribution of users by role",
        type: [RoleDistribution]
    })
    roleDistribution: RoleDistribution[]

    constructor(partial: Partial<UserAnalyticsEntity>) {
        Object.assign(this, partial)
    }
}
