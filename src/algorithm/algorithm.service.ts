import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FactoryEntity } from '@/factory/entities/factory.entity';
import { FactoryProductEntity } from '@/factory-products/entities/factory-product.entity';
import { UserEntity } from '@/users/entities/users.entity';
import { FactoryStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class AlgorithmService {
    private readonly logger = new Logger(AlgorithmService.name);

    constructor(
        private readonly prisma: PrismaService
    ) {}

    async findBestFactoryForVariants(variantIds: string[], orderId?: string): Promise<FactoryEntity | null> {
        try {
            // Get previously rejecting factories for this order if orderId is provided
            let rejectedFactoryIds: string[] = [];
            if (orderId) {
                const rejectedFactories = await this.prisma.rejectedOrder.findMany({
                    where: { orderId },
                    select: { factoryId: true }
                });
                if (rejectedFactories.length > 0) {
                    rejectedFactoryIds = rejectedFactories.map(rf => rf.factoryId);
                }else {
                    rejectedFactoryIds = []
                }
            }

            // Find eligible factories that can produce all variants and haven't rejected this order
            const factories = await this.prisma.factory.findMany({
                where: {
                    factoryStatus: FactoryStatus.APPROVED,
                    factoryOwnerId: {
                        notIn: rejectedFactoryIds
                    },
                    products: {
                        some: {
                            systemConfigVariantId: {
                                in: variantIds
                            }
                        }
                    }
                },
                include: {
                    owner: true,
                    products: {
                        where: {
                            systemConfigVariantId: {
                                in: variantIds
                            }
                        }
                    },
                    address: true
                }
            });

            if (factories.length === 0) {
                return null;
            }

            // Get system configuration for legitimacy points threshold
            const systemConfig = await this.prisma.systemConfigOrder.findFirst({
                where: { type: "SYSTEM_CONFIG_ORDER" }
            });

            if (!systemConfig) {
                return null;
            }

            // Score each factory based on various factors
            const factoryScores = await Promise.all(
                factories.map(async (factory) => {
                    // Check current workload (active orders)
                    const activeOrders = await this.prisma.order.count({
                        where: {
                            factoryId: factory.factoryOwnerId,
                            status: {
                                in: [
                                    OrderStatus.PENDING_ACCEPTANCE,
                                    OrderStatus.IN_PRODUCTION
                                ]
                            }
                        }
                    });

                    // Calculate capacity availability (as a percentage)
                    const totalCapacity = factory.maxPrintingCapacity;
                    const capacityScore = Math.max(0, (totalCapacity - activeOrders * 50) / totalCapacity);

                    // Check if factory can handle all variants
                    const canHandleAllVariants = variantIds.every((variantId) =>
                        factory.products.some((p) => p.systemConfigVariantId === variantId)
                    );

                    if (!canHandleAllVariants) {
                        return { factory, score: 0 };
                    }

                    // Calculate lead time score (shorter is better)
                    const leadTimeScore = factory.leadTime ? 1 / factory.leadTime : 0;

                    // Calculate specialization score
                    const specializationScore = this.calculateSpecializationScore(factory, variantIds, systemConfig);

                    // Calculate legitimacy points score
                    const maxLegitPoint = (systemConfig as any).maxLegitPoint || 100;
                    const legitPointScore = Math.min(1, factory.legitPoint / maxLegitPoint);

                    // Calculate production capacity score
                    const productionCapacityScore = this.calculateProductionCapacityScore(factory, variantIds, systemConfig);

                    // Get weights from system config with fallbacks
                    const weights = {
                        capacity: (systemConfig as any)?.capacityScoreWeight || 0.2,
                        leadTime: (systemConfig as any)?.leadTimeScoreWeight || 0.15,
                        specialization: (systemConfig as any)?.specializationScoreWeight || 0.15,
                        legitPoint: (systemConfig as any)?.legitPointScoreWeight || 0.25,
                        productionCapacity: (systemConfig as any)?.productionCapacityScoreWeight || 0.1
                    };

                    // Calculate final score
                    const finalScore = 
                        capacityScore * weights.capacity + 
                        leadTimeScore * weights.leadTime + 
                        specializationScore * weights.specialization + 
                        legitPointScore * weights.legitPoint + 
                        productionCapacityScore * weights.productionCapacity;

                    return { factory, score: finalScore };
                })
            );

            // Sort by score (highest first)
            factoryScores.sort((a, b) => b.score - a.score);

            // Return the best factory or null if none have a positive score
            if (factoryScores[0]?.score > 0) {
                return new FactoryEntity({
                    ...factoryScores[0].factory,
                    products: factoryScores[0].factory.products.map(
                        (p) => new FactoryProductEntity(p)
                    ),
                    owner: new UserEntity(factoryScores[0].factory.owner)
                });
            }
            return null;
        } catch (error) {
            this.logger.error(`Error finding best factory: ${error.message}`);
            return null;
        }
    }

    private calculateSpecializationScore(factory: any, variantIds: string[], systemConfig: any): number {
        try {
            // Calculate average production time as a measure of specialization
            // Lower time means more specialized/efficient
            const relevantProducts = factory.products.filter((p) =>
                variantIds.includes(p.systemConfigVariantId)
            );

            if (relevantProducts.length === 0) return 0;

            const avgProductionTime =
                relevantProducts.reduce(
                    (sum, product) => sum + product.productionTimeInMinutes,
                    0
                ) / relevantProducts.length;

            // Convert to a score where lower time means higher score
            // Using maxProductionTimeInMinutes from system config with fallback
            const maxProductionTime = (systemConfig as any).maxProductionTimeInMinutes || 300;
            return Math.max(0, 1 - avgProductionTime / maxProductionTime);
        } catch (error) {
            this.logger.error(`Error calculating specialization score: ${error.message}`);
            return 0;
        }
    }

    private calculateProductionCapacityScore(factory: any, variantIds: string[], systemConfig: any): number {
        try {
            // Get relevant factory products
            const relevantProducts = factory.products.filter((p) =>
                variantIds.includes(p.systemConfigVariantId)
            );

            if (relevantProducts.length === 0) return 0;

            // Calculate average production capacity
            const avgProductionCapacity = relevantProducts.reduce(
                (sum, product) => sum + product.productionCapacity,
                0
            ) / relevantProducts.length;

            // Normalize score (higher capacity = higher score)
            // Using maxProductionCapacity from system config with fallback
            const maxProductionCapacity = (systemConfig as any).maxProductionCapacity || 1000;
            return Math.min(1, avgProductionCapacity / maxProductionCapacity);
        } catch (error) {
            this.logger.error(`Error calculating production capacity score: ${error.message}`);
            return 0;
        }
    }
}