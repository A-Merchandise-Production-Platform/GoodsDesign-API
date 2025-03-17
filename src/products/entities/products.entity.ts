import { ApiProperty } from "@nestjs/swagger"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "src/categories/entities/categories.entity"
import { BlankVariancesEntity } from "src/blank-variances/entities/blank-variances.entity"

@ObjectType()
export class ProductEntity {
    @Field(() => ID)
    @ApiProperty({
        description: "The unique identifier of the product",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: string

    @Field(() => String)
    @ApiProperty({
        description: "The name of the product",
        example: "Modern Chair"
    })
    name: string

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The URL of the product image",
        example: "https://example.com/images/modern-chair.jpg",
        required: false
    })
    imageUrl?: string

    @Field(() => String, { nullable: true })
    model3DUrl?: string

    @Field(() => Boolean)
    @ApiProperty({
        description: "Whether the product is active",
        example: true
    })
    isActive: boolean

    @Field(() => Boolean)
    @ApiProperty({
        description: "Whether the product has been deleted",
        example: false
    })
    isDeleted: boolean

    @Field(() => Date)
    @ApiProperty({
        description: "The date and time when the product was created",
        example: "2024-03-05T00:00:00.000Z"
    })
    createdAt: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who created the product",
        example: "user123",
        required: false
    })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date and time when the product was last updated",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who last updated the product",
        example: "user123",
        required: false
    })
    updatedBy?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date and time when the product was deleted",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    deletedAt?: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who deleted the product",
        example: "user123",
        required: false
    })
    deletedBy?: string

    @Field(() => String)
    @ApiProperty({
        description: "The ID of the category this product belongs to",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    categoryId: string

    @Field(() => CategoryEntity, { nullable: true })
    @ApiProperty({
        description: "The category this product belongs to",
        type: CategoryEntity,
        example: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Furniture",
            description: "High-quality furniture items",
            imageUrl: "https://example.com/images/furniture.jpg",
            isActive: true,
            isDeleted: false,
            createdAt: "2024-03-05T00:00:00.000Z",
            createdBy: "user123",
            updatedAt: null,
            updatedBy: null
        },
        nullable: false
    })
    category?: CategoryEntity

    @Field(() => [BlankVariancesEntity], { nullable: true })
    @ApiProperty({
        description: "The blank variances of the product",
        type: [BlankVariancesEntity],
        example: []
    })
    blankVariances?: BlankVariancesEntity[]

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial)
    }
}
