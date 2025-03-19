import { Resolver, Query, Args, Mutation } from "@nestjs/graphql"
import { BlankVariancesService } from "./blank-variances.service"
import { BlankVariancesEntity } from "./entities/blank-variances.entity"
import { CreateBlankVarianceDto } from "./dto/create-blank-variance.dto"
import { UpdateBlankVarianceDto } from "./dto/update-blank-variance.dto"
@Resolver(() => BlankVariancesEntity)
export class BlankVariancesResolver {
    constructor(private readonly blankVariancesService: BlankVariancesService) {}

    @Query(() => [BlankVariancesEntity])
    async blankVariances(): Promise<BlankVariancesEntity[]> {
        return this.blankVariancesService.findAll()
    }

    @Query(() => BlankVariancesEntity, { nullable: true })
    async blankVariance(@Args("id") id: string): Promise<BlankVariancesEntity | null> {
        return this.blankVariancesService.findOne(id)
    }

    @Mutation(() => BlankVariancesEntity)
    async createBlankVariance(
        @Args("createBlankVarianceInput") createBlankVarianceInput: CreateBlankVarianceDto
    ): Promise<BlankVariancesEntity> {
        return this.blankVariancesService.create(createBlankVarianceInput)
    }

    @Mutation(() => BlankVariancesEntity)
    async updateBlankVariance(
        @Args("id") id: string,
        @Args("updateBlankVarianceInput") updateBlankVarianceInput: UpdateBlankVarianceDto
    ): Promise<BlankVariancesEntity> {
        return this.blankVariancesService.update(id, updateBlankVarianceInput)
    }

    @Mutation(() => BlankVariancesEntity)
    async deleteBlankVariance(@Args("id") id: string): Promise<BlankVariancesEntity> {
        return this.blankVariancesService.remove(id)
    }
}
