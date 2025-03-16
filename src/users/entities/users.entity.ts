import { ApiProperty } from "@nestjs/swagger"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Roles } from "@prisma/client"

@ObjectType()
export class UserEntity {
    @Field(() => ID)
    @ApiProperty({
        description: "The unique identifier of the user",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The name of the user",
        example: "John Doe",
        required: false
    })
    name?: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The email of the user",
        example: "john.doe@example.com",
        required: false
    })
    email?: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The phone number of the user",
        example: "+1234567890",
        required: false
    })
    phoneNumber?: string

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The URL of the user's profile image",
        example: "https://example.com/images/profile.jpg",
        required: false
    })
    imageUrl?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date of birth of the user",
        example: "1990-01-01T00:00:00.000Z",
        required: false
    })
    dateOfBirth?: Date

    @Field(() => Boolean)
    @ApiProperty({
        description: "The gender of the user (true for male, false for female)",
        example: true
    })
    gender: boolean

    @Field(() => Roles)
    @ApiProperty({
        description: "The role of the user",
        example: "USER",
        enum: Roles
    })
    role: Roles

    @Field(() => Boolean)
    @ApiProperty({
        description: "Whether the user is active",
        example: true
    })
    isActive: boolean

    @Field(() => Boolean)
    @ApiProperty({
        description: "Whether the user has been deleted",
        example: false
    })
    isDeleted: boolean

    @Field(() => Date)
    @ApiProperty({
        description: "The date and time when the user was created",
        example: "2024-03-05T00:00:00.000Z"
    })
    createdAt: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who created this user",
        example: "user123",
        required: false
    })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date and time when the user was last updated",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who last updated this user",
        example: "user123",
        required: false
    })
    updatedBy?: string

    @Field(() => Date, { nullable: true })
    @ApiProperty({
        description: "The date and time when the user was deleted",
        example: "2024-03-05T00:00:00.000Z",
        required: false
    })
    deletedAt?: Date

    @Field(() => String, { nullable: true })
    @ApiProperty({
        description: "The ID of the user who deleted this user",
        example: "user123",
        required: false
    })
    deletedBy?: string

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }
}
