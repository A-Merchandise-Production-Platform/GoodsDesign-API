import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { CreateEvaluationCriteriaInput } from './dto/create-evaluation-criteria.input';
import { UpdateEvaluationCriteriaInput } from './dto/update-evaluation-criteria.input';
import { EvaluationCriteriaEntity } from './entities/evaluation-criteria.entity';

@Resolver(() => EvaluationCriteriaEntity)
export class EvaluationCriteriaResolver {
  constructor(private readonly evaluationCriteriaService: EvaluationCriteriaService) {}

  @Mutation(() => EvaluationCriteriaEntity)
  createEvaluationCriteria(
    @Args('createEvaluationCriteriaInput')
    createEvaluationCriteriaInput: CreateEvaluationCriteriaInput,
  ) {
    return this.evaluationCriteriaService.create(createEvaluationCriteriaInput);
  }

  @Query(() => [EvaluationCriteriaEntity], { name: 'evaluationCriteria' })
  findAll() {
    return this.evaluationCriteriaService.findAll();
  }

  @Query(() => EvaluationCriteriaEntity, { name: 'evaluationCriteria' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.evaluationCriteriaService.findOne(id);
  }

  @Query(() => [EvaluationCriteriaEntity], { name: 'evaluationCriteriaByProduct' })
  findByProduct(@Args('productId', { type: () => ID }) productId: string) {
    return this.evaluationCriteriaService.findByProduct(productId);
  }

  @Mutation(() => EvaluationCriteriaEntity)
  updateEvaluationCriteria(
    @Args('updateEvaluationCriteriaInput')
    updateEvaluationCriteriaInput: UpdateEvaluationCriteriaInput,
  ) {
    return this.evaluationCriteriaService.update(updateEvaluationCriteriaInput);
  }

  @Mutation(() => EvaluationCriteriaEntity)
  removeEvaluationCriteria(@Args('id', { type: () => ID }) id: string) {
    return this.evaluationCriteriaService.remove(id);
  }
} 