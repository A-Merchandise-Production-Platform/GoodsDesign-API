import { Field, ID, ObjectType, InputType, registerEnumType, Int } from "@nestjs/graphql"
import { Roles } from "@prisma/client"
import { IsOptional } from "class-validator"

export enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}

registerEnumType(SortOrder, {
    name: "SortOrder",
    description: "Sort order"
})

registerEnumType(Roles, {
    name: "Roles",
    description: "User roles"
})

@InputType()
export class PaginationInput {
    @Field(() => Int, { defaultValue: 1 })
    page: number

    @Field(() => Int, { defaultValue: 10 })
    limit: number
}

@ObjectType()
export class PaginationMeta {
    @Field(() => Int)
    total: number

    @Field(() => Int)
    page: number

    @Field(() => Int)
    limit: number

    @Field(() => Int)
    totalPages: number
}

@ObjectType()
export class PaginatedUsers {
    @Field(() => [GraphQLUser])
    items: GraphQLUser[]

    @Field(() => PaginationMeta)
    meta: PaginationMeta
}

@InputType()
export class UserSort {
    @Field(() => SortOrder, { nullable: true })
    name?: SortOrder

    @Field(() => SortOrder, { nullable: true })
    email?: SortOrder

    @Field(() => SortOrder, { nullable: true })
    createdAt?: SortOrder

    @Field(() => SortOrder, { nullable: true })
    updatedAt?: SortOrder
}

@InputType()
export class UserFilter {
    @Field(() => String, { nullable: true })
    @IsOptional()
    email?: string

    @Field(() => Roles, { nullable: true })
    @IsOptional()
    role?: Roles

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    isActive?: boolean

    @Field(() => UserSort, { nullable: true })
    @IsOptional()
    sort?: UserSort

    @Field(() => PaginationInput, { nullable: true })
    @IsOptional()
    pagination?: PaginationInput
}

@ObjectType()
export class GraphQLUser {
    @Field(() => ID)
    id: string

    @Field(() => String, { nullable: true })
    email?: string

    @Field(() => String, { nullable: true })
    name?: string

    @Field(() => String, { nullable: true })
    phoneNumber?: string

    @Field(() => Boolean)
    gender: boolean

    @Field(() => Date, { nullable: true })
    dateOfBirth?: Date

    @Field(() => String, { nullable: true })
    imageUrl?: string

    @Field(() => Boolean)
    isActive: boolean

    @Field(() => Boolean)
    isDeleted: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => String, { nullable: true })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    updatedBy?: string

    @Field(() => String, { nullable: true })
    deletedBy?: string

    @Field(() => Date, { nullable: true })
    deletedAt?: Date

    @Field(() => Roles)
    role: Roles

    constructor(partial: Partial<GraphQLUser>) {
        Object.assign(this, partial)
    }
}
