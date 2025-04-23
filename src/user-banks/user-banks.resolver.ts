import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "src/auth"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { UserEntity } from "src/users"
import { UserBanksService } from "./user-banks.service"
import { CreateUserBankInput } from "./dto/create-user-bank.input"
import { UpdateUserBankInput } from "./dto/update-user-bank.input"
import { UserBankEntity } from "./entities/user-bank.entity"

@Resolver(() => UserBankEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class UserBanksResolver {
    constructor(private readonly userBanksService: UserBanksService) {}

    @Mutation(() => UserBankEntity)
    async createUserBank(
        @Args("createUserBankInput") createUserBankInput: CreateUserBankInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.userBanksService.createUserBank(createUserBankInput, user)
    }

    @Query(() => [UserBankEntity])
    async userBanks(@CurrentUser() user: UserEntity) {
        return this.userBanksService.getUserBanks(user)
    }

    @Query(() => [UserBankEntity])
    async userBanksByUserId(@Args("id") id: string) {
        return this.userBanksService.getUserBanksByUserId(id)
    }
    @Query(() => UserBankEntity)
    async userBank(@Args("id") id: string, @CurrentUser() user: UserEntity) {
        return this.userBanksService.getUserBank(id, user)
    }

    @Mutation(() => UserBankEntity)
    async updateUserBank(
        @Args("id") id: string,
        @Args("updateUserBankInput") updateUserBankInput: UpdateUserBankInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.userBanksService.updateUserBank(id, updateUserBankInput, user)
    }

    @Mutation(() => UserBankEntity)
    async deleteUserBank(@Args("id") id: string, @CurrentUser() user: UserEntity) {
        return this.userBanksService.deleteUserBank(id, user)
    }
} 