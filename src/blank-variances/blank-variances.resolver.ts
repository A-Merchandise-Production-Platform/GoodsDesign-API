import { Resolver, Query, Args } from "@nestjs/graphql"
import { BlankVariancesService } from "./blank-variances.service"
import { BlankVariancesEntity } from "./entities/blank-variances.entity"

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
}
