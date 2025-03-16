import { ApiProperty } from "@nestjs/swagger"
import { CategoryEntity } from "src/categories/entities/categories.entity"

export class ProductResponseDto {
    @ApiProperty({
        description: "The unique identifier of the product",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: string

    @ApiProperty({
        description: "The name of the product",
        example: "Modern Chair"
    })
    name: string

    @ApiProperty({
        description: "The description of the product",
        example: "A comfortable modern chair with ergonomic design",
        required: false
    })
    description: string | null

    @ApiProperty({
        description: "The URL of the product image",
        example: "https://example.com/images/modern-chair.jpg",
        required: false
    })
    imageUrl: string | null

    @ApiProperty({
        description: "The URL of the 3D model",
        example: "https://example.com/models/modern-chair.glb",
        required: false
    })
    model3DUrl: string | null

    @ApiProperty({
        description: "The ID of the category this product belongs to",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    categoryId: string

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
    category: CategoryEntity

    @ApiProperty({
        description: "Whether the product is active",
        example: true
    })
    isActive: boolean

    @ApiProperty({
        description: "Whether the product has been deleted",
        example: false
    })
    isDeleted: boolean

    @ApiProperty({
        description: "The date and time when the product was created",
        example: "2024-03-05T00:00:00.000Z"
    })
    createdAt: Date

    @ApiProperty({
        description: "The ID of the user who created the product",
        example: "user123",
        required: false
    })
    createdBy: string | null

    @ApiProperty({
        description: "The date and time when the product was last updated",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    updatedAt: Date | null

    @ApiProperty({
        description: "The ID of the user who last updated the product",
        example: "user123",
        required: false
    })
    updatedBy: string | null
}
