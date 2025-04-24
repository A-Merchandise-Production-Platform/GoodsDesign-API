import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateProductDesignDto } from "./dto/create-product-design.dto"
import { UpdateProductDesignDto } from "./dto/update-product-design.dto"
import { ProductDesignEntity } from "./entities/product-design.entity"

@Injectable()
export class ProductDesignService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDesignDto: CreateProductDesignDto): Promise<ProductDesignEntity> {
        const { userId, systemConfigVariantId, ...designData } = createProductDesignDto

        if (!systemConfigVariantId) {
            throw new Error("systemConfigVariantId is required")
        }

        const systemConfigVariant = await this.prisma.systemConfigVariant.findFirst({
            where: {
                id: systemConfigVariantId
            }
        })

        //get position type
        const positionType = await this.prisma.productPositionType.findMany({
            where: {
                productId: systemConfigVariant.productId
            }
        })

        const designPositionsData = positionType.map((p) => {
            return {
                designJSON: [],
                productPositionTypeId: p.id
            }
        })

        const data = await this.prisma.productDesign.create({
            data: {
                ...designData,
                user: {
                    connect: { id: userId }
                },
                systemConfigVariant: {
                    connect: { id: systemConfigVariantId }
                },
                designPositions: {
                    createMany: {
                        data: designPositionsData
                    }
                }
            },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: true
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })
        return new ProductDesignEntity(data)
    }

    async findAll(userId?: string): Promise<ProductDesignEntity[]> {
        const data = await this.prisma.productDesign.findMany({
            where: {
                isDeleted: false,
                ...(userId ? { userId } : {})
            },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })
        return data.map((item) => new ProductDesignEntity(item))
    }

    async findOne(id: string): Promise<ProductDesignEntity> {
        const data = await this.prisma.productDesign.findUnique({
            where: {
                id,
                isDeleted: false
            },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: true
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })
        return new ProductDesignEntity(data)
    }

    async update(
        id: string,
        updateProductDesignDto: UpdateProductDesignDto
    ): Promise<ProductDesignEntity> {
        const data = await this.prisma.productDesign.update({
            where: {
                id,
                isDeleted: false
            },
            data: updateProductDesignDto,
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: true
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })
        return new ProductDesignEntity(data)
    }

    async remove(id: string): Promise<ProductDesignEntity> {
        // First check if the product design exists
        const existingDesign = await this.prisma.productDesign.findUnique({
            where: { id }
        })

        if (!existingDesign) {
            throw new Error(`Product design with ID ${id} not found`)
        }

        // Soft delete the product design
        const data = await this.prisma.productDesign.update({
            where: { id },
            data: { isDeleted: true },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: true
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })

        return new ProductDesignEntity(data)
    }

    async duplicate(id: string, userId: string): Promise<ProductDesignEntity> {
        // Get the original design with all its relations
        const originalDesign = await this.prisma.productDesign.findUnique({
            where: {
                id,
                isDeleted: false
            },
            include: {
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })

        if (!originalDesign) {
            throw new Error("Design not found")
        }

        // Create the new design with the same data but new ID
        const newDesign = await this.prisma.productDesign.create({
            data: {
                userId,
                systemConfigVariantId: originalDesign.systemConfigVariantId,
                isFinalized: false, // Reset finalized status
                isPublic: false, // Reset public status
                isTemplate: false, // Reset template status
                thumbnailUrl: originalDesign.thumbnailUrl,
                designPositions: {
                    create: originalDesign.designPositions.map((position) => ({
                        productPositionTypeId: position.productPositionTypeId,
                        designJSON: position.designJSON
                    }))
                }
            },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: true
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })

        return new ProductDesignEntity(newDesign)
    }

    async getTemplateProductDesigns(): Promise<ProductDesignEntity[]> {
        const data = await this.prisma.productDesign.findMany({
            where: {
                isDeleted: false,
                isTemplate: true,
            },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })
        return data.map((item) => new ProductDesignEntity(item))
    }
    async getPublicProductDesigns(): Promise<ProductDesignEntity[]> {
        const data = await this.prisma.productDesign.findMany({
            where: {
                isDeleted: false,
                isPublic: true,
                isTemplate: false,
            },
            include: {
                user: true,
                systemConfigVariant: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                designPositions: {
                    include: {
                        positionType: true
                    }
                }
            }
        })
        return data.map((item) => new ProductDesignEntity(item))
    }
}
