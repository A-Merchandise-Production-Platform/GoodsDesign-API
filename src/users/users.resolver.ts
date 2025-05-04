import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/users.entity"
import { UsersService } from "./users.service"
import { UpdateProfileDto } from "src/users/dto/update-profile.dto"
import { UpdatePhoneNumberDto } from "src/users/dto/update-phone-number.dto"

@Resolver(() => UserEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query(() => [UserEntity], { name: "users" })
    async getUsers(@CurrentUser() user: UserEntity) {
        return this.usersService.findAll(user)
    }

    @Query(() => [UserEntity], { name: "staffs" })
    async getStaffs(@CurrentUser() user: UserEntity) {
        return this.usersService.findAllStaff(user)
    }

    @Query(() => UserEntity, { name: "user" })
    async getUser(@CurrentUser() user: UserEntity, @Args("id") id: string) {
        return this.usersService.findOne(id, user)
    }

    @Mutation(() => UserEntity, { name: "createUser" })
    async createUser(
        @CurrentUser() user: UserEntity,
        @Args("createUserInput") createUserInput: CreateUserDto
    ) {
        return this.usersService.create(createUserInput, user)
    }

    @Mutation(() => UserEntity, { name: "updateUser" })
    async updateUser(
        @CurrentUser() user: UserEntity,
        @Args("updateUserInput") updateUserInput: UpdateUserDto,
        @Args("id") id: string
    ) {
        return this.usersService.update(id, updateUserInput, user)
    }

    @Mutation(() => UserEntity, { name: "deleteUser" })
    async deleteUser(@CurrentUser() user: UserEntity, @Args("id") id: string) {
        return this.usersService.remove(id, user)
    }

    @Query(() => [UserEntity], { name: "availableStaffForFactory" })
    async getAvailableStaffForFactory(@CurrentUser() user: UserEntity) {
        return this.usersService.getAvailableStaffForFactory(user)
    }

    @Mutation(() => UserEntity, { name: "updateProfile" })
    async updateProfile(
        @CurrentUser() user: UserEntity,
        @Args("updateProfileInput") updateProfileInput: UpdateProfileDto
    ) {
        return this.usersService.updateProfile(user.id, updateProfileInput, user)
    }

    @Mutation(() => UserEntity, { name: "updatePhoneNumber" })
    async updatePhoneNumber(
        @CurrentUser() user: UserEntity,
        @Args("updatePhoneNumberInput") updatePhoneNumberInput: UpdatePhoneNumberDto
    ) {
        return this.usersService.updatePhoneNumber(user.id, updatePhoneNumberInput, user)
    }
}
