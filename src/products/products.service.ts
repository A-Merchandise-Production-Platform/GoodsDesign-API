import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateProductDto, UpdateProductDto } from "./dto"
import { ProductEntity } from "./entities/products.entity"
import { CategoriesService } from "src/categories"
import { SystemConfigDiscountEntity } from "src/system-config-discount/entities/system-config-discount.entity"

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private readonly categoryService: CategoriesService
    ) {}

    async create(createProductDto: CreateProductDto, userId: string): Promise<ProductEntity> {
        const category = await this.categoryService.findOne(createProductDto.categoryId)

        if (!category) {
            throw new BadRequestException(
                `Category with ID "${createProductDto.categoryId}" not found or is deleted`
            )
        }

        if (!category.isActive) {
            throw new BadRequestException(
                `Category with ID "${createProductDto.categoryId}" is inactive`
            )
        }

        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                createdBy: userId
            },
            include: {
                category: true
            }
        })
        return new ProductEntity(product)
    }

    async findAll(includeDeleted = false): Promise<ProductEntity[]> {
        const products = await this.prisma.product.findMany({
            where: includeDeleted ? undefined : { isDeleted: false },
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                blankVariances: true,
                positionTypes: true,
                discounts: true
            }
        })
        return products.map(
            (product) =>
                new ProductEntity({
                    ...product,
                    discounts: product.discounts.map(
                        (discount) => new SystemConfigDiscountEntity(discount)
                    )
                })
        )
    }

    async findOne(id: string, includeDeleted = false): Promise<ProductEntity> {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                ...(includeDeleted ? {} : { isDeleted: false })
            },
            include: {
                category: true,
                blankVariances: true,
                discounts: true
            }
        })

        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`)
        }

        return new ProductEntity({
            ...product,
            discounts: product.discounts.map((discount) => new SystemConfigDiscountEntity(discount))
        })
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto,
        userId: string
    ): Promise<ProductEntity> {
        await this.findOne(id)

        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...updateProductDto,
                updatedAt: new Date(),
                updatedBy: userId
            },
            include: {
                category: true
            }
        })
        return new ProductEntity(product)
    }

    async remove(id: string, userId: string): Promise<ProductEntity> {
        await this.findOne(id)

        const product = await this.prisma.product.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            include: {
                category: true
            }
        })
        return new ProductEntity(product)
    }

    async restore(id: string, userId: string): Promise<ProductEntity> {
        const product = await this.findOne(id, true)

        if (!product.isDeleted) {
            throw new NotFoundException(`Product with ID "${id}" is not deleted`)
        }

        const restoredProduct = await this.prisma.product.update({
            where: { id },
            data: {
                isDeleted: false,
                deletedAt: null,
                deletedBy: null,
                updatedAt: new Date(),
                updatedBy: userId
            },
            include: {
                category: true
            }
        })
        return new ProductEntity(restoredProduct)
    }

    async toggleActive(id: string, userId: string): Promise<ProductEntity> {
        const product = await this.findOne(id)

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                isActive: !product.isActive,
                updatedAt: new Date(),
                updatedBy: userId
            },
            include: {
                category: true
            }
        })
        return new ProductEntity(updatedProduct)
    }

    async findByCategory(categoryId: string, includeDeleted = false): Promise<ProductEntity[]> {
        const products = await this.prisma.product.findMany({
            where: {
                categoryId,
                ...(includeDeleted ? {} : { isDeleted: false })
            },
            orderBy: { createdAt: "desc" },
            include: {
                category: true
            }
        })
        return products.map((product) => new ProductEntity(product))
    }
}
