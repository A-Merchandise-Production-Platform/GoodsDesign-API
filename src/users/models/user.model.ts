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
    email?: SortOrder

    @Field(() => String, { nullable: true })
    @IsOptional()
    createdAt?: SortOrder
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
