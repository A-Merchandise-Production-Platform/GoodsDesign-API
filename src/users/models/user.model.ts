import { Field, ID, ObjectType, InputType, registerEnumType, Int } from "@nestjs/graphql"
import { Roles } from "@prisma/client"
import { IsOptional, IsEmail, IsEnum } from "class-validator"
import { UserEntity } from "../entities/users.entity"

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
    @Field(() => Number, { defaultValue: 1 })
    page: number

    @Field(() => Number, { defaultValue: 10 })
    limit: number
}

@InputType()
export class SortInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    email?: "asc" | "desc"

    @Field(() => String, { nullable: true })
    @IsOptional()
    createdAt?: "asc" | "desc"
}

@ObjectType()
export class PaginationMeta {
    @Field(() => Number)
    total: number

    @Field(() => Number)
    page: number

    @Field(() => Number)
    limit: number

    @Field(() => Number)
    totalPages: number
}

@ObjectType()
export class PaginatedUsers {
    @Field(() => [UserEntity])
    items: UserEntity[]

    @Field(() => PaginationMeta)
    meta: PaginationMeta
}

@InputType()
export class UserFilter {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string

    @Field(() => Roles, { nullable: true })
    @IsOptional()
    @IsEnum(Roles)
    role?: Roles

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    isActive?: boolean

    @Field(() => PaginationInput, { nullable: true })
    @IsOptional()
    pagination?: PaginationInput

    @Field(() => SortInput, { nullable: true })
    @IsOptional()
    sort?: SortInput
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
