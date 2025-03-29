import { Resolver, Query, Mutation, Args, Float } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { SystemConfigDiscountService } from "./system-config-discount.service"
import { SystemConfigDiscountEntity } from "./entities/system-config-discount.entity"
import { CreateSystemConfigDiscountDto } from "./dto/create-system-config-discount.dto"
import { UpdateSystemConfigDiscountDto } from "./dto/update-system-config-discount.dto"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"

@Resolver(() => SystemConfigDiscountEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class SystemConfigDiscountResolver {
    constructor(private readonly discountService: SystemConfigDiscountService) {}

    @Query(() => [SystemConfigDiscountEntity])
    async systemConfigDiscounts(): Promise<SystemConfigDiscountEntity[]> {
        return this.discountService.findAll()
    }

    @Query(() => SystemConfigDiscountEntity)
    async systemConfigDiscount(@Args("id") id: string): Promise<SystemConfigDiscountEntity> {
        return this.discountService.findOne(id)
    }

    @Query(() => Float)
    async getApplicableDiscount(
        @Args("productId") productId: string,
        @Args("quantity") quantity: number
    ): Promise<number> {
        return this.discountService.getApplicableDiscount(productId, quantity)
    }

    @Mutation(() => SystemConfigDiscountEntity)
    async createSystemConfigDiscount(
        @Args("createDiscountInput") createDto: CreateSystemConfigDiscountDto
    ): Promise<SystemConfigDiscountEntity> {
        return this.discountService.create(createDto)
    }

    @Mutation(() => SystemConfigDiscountEntity)
    async updateSystemConfigDiscount(
        @Args("id") id: string,
        @Args("updateDiscountInput") updateDto: UpdateSystemConfigDiscountDto
    ): Promise<SystemConfigDiscountEntity> {
        return this.discountService.update(id, updateDto)
    }

    @Mutation(() => SystemConfigDiscountEntity)
    async removeSystemConfigDiscount(@Args("id") id: string): Promise<SystemConfigDiscountEntity> {
        return this.discountService.remove(id)
    }

    @Query(() => [SystemConfigDiscountEntity])
    async getAllDiscountByProductId(
        @Args("productId") productId: string
    ): Promise<SystemConfigDiscountEntity[]> {
        return this.discountService.getAllDiscountByProductId(productId)
    }
}
