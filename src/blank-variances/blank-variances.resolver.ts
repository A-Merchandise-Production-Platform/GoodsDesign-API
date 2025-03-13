import { Resolver, Query, Args } from '@nestjs/graphql';
import { BlankVariancesService } from './blank-variances.service';
import { BlankVariance } from './models/blank-variance.model';

@Resolver('BlankVariance')
export class BlankVariancesResolver {
  constructor(private readonly blankVariancesService: BlankVariancesService) {}

  @Query(() => [BlankVariance])
  async blankVariances(): Promise<BlankVariance[]> {
    return this.blankVariancesService.findAll();
  }

  @Query(() => BlankVariance, { nullable: true })
  async blankVariance(@Args('id') id: string): Promise<BlankVariance | null> {
    return this.blankVariancesService.findOne(id);
  }
}