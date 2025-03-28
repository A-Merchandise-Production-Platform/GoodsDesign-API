import { Resolver, Query, Args, Mutation } from "@nestjs/graphql"
import { BlankVariancesService } from "./blank-variances.service"
import { BlankVariancesEntity } from "./entities/blank-variances.entity"
import { CreateBlankVarianceDto, UpdateBlankVarianceDto } from "./dto"
import { CreateBlankVarianceInput, UpdateBlankVarianceInput } from "./dto"
import { BlankVariance } from "./entities/blank-variances.entity"
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

    @Mutation(() => BlankVariance)
    async createBlankVariance(
        @Args('createBlankVarianceInput') createBlankVarianceInput: CreateBlankVarianceInput
    ): Promise<BlankVariance> {
        return this.blankVariancesService.create(createBlankVarianceInput)
    }

    @Mutation(() => BlankVariance)
    async updateBlankVariance(
        @Args('id') id: string,
        @Args('updateBlankVarianceInput') updateBlankVarianceInput: UpdateBlankVarianceInput
    ): Promise<BlankVariance> {
        return this.blankVariancesService.update(id, updateBlankVarianceInput)
    }

    @Mutation(() => BlankVariancesEntity)
    async deleteBlankVariance(@Args("id") id: string): Promise<BlankVariancesEntity> {
        return this.blankVariancesService.remove(id)
    }
}
