import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { VoucherEntity } from "./entities/voucher.entity"
import { VouchersService } from "./vouchers.service"
import { UserEntity } from "src/users"
import { Auth, CurrentUser } from "src/auth"
import { CreateVoucherInput } from "src/vouchers/dto"
import { Roles } from "@prisma/client"

@Resolver(() => VoucherEntity)
@UseGuards(GraphqlJwtAuthGuard, RolesGuard)
export class VouchersResolver {
    constructor(private readonly vouchersService: VouchersService) {}

    @Query(() => [VoucherEntity])
    async availableVouchers(@CurrentUser() user: UserEntity) {
        return this.vouchersService.getAvailableVouchersForUser(user.id)
    }

    @Query(() => [VoucherEntity])
    async allPublicVouchers() {
        return this.vouchersService.getAllPublicVouchers()
    }

    @Query(() => [VoucherEntity])
    async allVouchersOfUser(@CurrentUser() user: UserEntity) {
        return this.vouchersService.getAllVouchersOfUser(user.id)
    }

    @Query(() => VoucherEntity)
    async voucherById(@Args("id") id: string) {
        return this.vouchersService.getVoucherById(id)
    }

    @Query(() => [VoucherEntity])
    async allSystemVouchers() {
        return this.vouchersService.getAllSystemVouchers()
    }

    @Mutation(() => VoucherEntity)
    async createVoucher(@Args("input") input: CreateVoucherInput) {
        console.log(input)
        return this.vouchersService.createVoucher(input)
    }
}
