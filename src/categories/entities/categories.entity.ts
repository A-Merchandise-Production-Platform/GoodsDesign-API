import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@ObjectType()
export class CategoryEntity {
    @Field(() => ID)
    @ApiProperty({
        description: "The unique identifier of the category",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: string

    @Field(() => String)
    @ApiProperty({
        description: "The name of the category",
        example: "Electronics"
    })
    name: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The description of the category",
        example: "Electronic devices and accessories",
        required: false
    })
    description?: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The URL of the category image",
        example: "https://example.com/images/electronics.jpg",
        required: false
    })
    imageUrl?: string

    @Field(() => Boolean)
    @ApiProperty({
        description: "Whether the category is active",
        example: true
    })
    isActive: boolean

    @Field(() => Boolean)
    @ApiProperty({
        description: "Whether the category has been deleted",
        example: false
    })
    isDeleted: boolean

    @Field(() => Date)
    @ApiProperty({
        description: "The date and time when the category was created",
        example: "2024-03-05T00:00:00.000Z"
    })
    createdAt: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who created the category",
        example: "user123",
        required: false
    })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date and time when the category was last updated",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who last updated the category",
        example: "user123",
        required: false
    })
    updatedBy?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date and time when the category was deleted",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    deletedAt?: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who deleted the category",
        example: "user123",
        required: false
    })
    deletedBy?: string

    @Field(() => Int, { nullable: true })
    @ApiProperty({
        description: "The total number of products in the category",
        example: 100,
        required: false
    })
    totalProducts?: number

    constructor(partial: Partial<CategoryEntity>) {
        Object.assign(this, partial)
    }
}
