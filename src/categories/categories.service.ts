import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { UpdateCategoryDto } from "./dto/update-category.dto"
import { CategoryEntity } from "./entities/categories.entity"
import { CategorySearchEntity } from "./entities/category-search.entity"

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    private async toCategoryResponse(category: any): Promise<CategoryEntity> {
        const totalProducts = await this.prisma.product.count({
            where: {
                categoryId: category.id,
                isDeleted: false
            }
        })

        return new CategoryEntity({
            ...category,
            totalProducts
        })
    }

    async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<CategoryEntity> {
        const category = await this.prisma.category.create({
            data: {
                ...createCategoryDto,
                createdBy: userId,
                isActive: true
            }
        })

        return this.toCategoryResponse(category)
    }

    async findAll(searchInput?: CategorySearchEntity): Promise<CategoryEntity[]> {
        const where: any = {
            isDeleted: false
        }

        if (searchInput) {
            if (searchInput.name) {
                where.name = {
                    contains: searchInput.name,
                    mode: "insensitive"
                }
            }

            if (searchInput.description) {
                where.description = {
                    contains: searchInput.description,
                    mode: "insensitive"
                }
            }

            if (searchInput.isActive !== undefined) {
                where.isActive = searchInput.isActive
            }

            if (searchInput.isDeleted !== undefined) {
                where.isDeleted = searchInput.isDeleted
            }

            if (searchInput.createdBy) {
                where.createdBy = searchInput.createdBy
            }

            if (searchInput.updatedBy) {
                where.updatedBy = searchInput.updatedBy
            }

            if (searchInput.createdAtStart || searchInput.createdAtEnd) {
                where.createdAt = {}
                if (searchInput.createdAtStart) {
                    where.createdAt.gte = searchInput.createdAtStart
                }
                if (searchInput.createdAtEnd) {
                    where.createdAt.lte = searchInput.createdAtEnd
                }
            }

            if (searchInput.updatedAtStart || searchInput.updatedAtEnd) {
                where.updatedAt = {}
                if (searchInput.updatedAtStart) {
                    where.updatedAt.gte = searchInput.updatedAtStart
                }
                if (searchInput.updatedAtEnd) {
                    where.updatedAt.lte = searchInput.updatedAtEnd
                }
            }
        }

        const categories = await this.prisma.category.findMany({ where })
        return Promise.all(categories.map((category) => this.toCategoryResponse(category)))
    }

    async findOne(id: string, includeDeleted = false): Promise<CategoryEntity> {
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                ...(!includeDeleted && { isDeleted: false })
            }
        })

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`)
        }

        return this.toCategoryResponse(category)
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
        userId: string
    ): Promise<CategoryEntity> {
        await this.findOne(id)

        const category = await this.prisma.category.update({
            where: { id },
            data: {
                ...updateCategoryDto,
                updatedAt: new Date(),
                updatedBy: userId
            }
        })

        return this.toCategoryResponse(category)
    }

    async remove(id: string, userId: string): Promise<CategoryEntity> {
        await this.findOne(id)

        const category = await this.prisma.category.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            }
        })

        return this.toCategoryResponse(category)
    }

    async restore(id: string, userId: string): Promise<CategoryEntity> {
        const category = await this.findOne(id, true)

        if (!category.isDeleted) {
            throw new NotFoundException(`Category with ID ${id} is not deleted`)
        }

        const restoredCategory = await this.prisma.category.update({
            where: { id },
            data: {
                isDeleted: false,
                deletedAt: null,
                deletedBy: null,
                updatedAt: new Date(),
                updatedBy: userId
            }
        })

        return this.toCategoryResponse(restoredCategory)
    }

    async toggleActive(id: string, userId: string): Promise<CategoryEntity> {
        const category = await this.findOne(id)

        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: {
                isActive: !category.isActive,
                updatedAt: new Date(),
                updatedBy: userId
            }
        })

        return this.toCategoryResponse(updatedCategory)
    }
}
