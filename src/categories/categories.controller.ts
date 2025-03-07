import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    ParseBoolPipe
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger"
import { CategoriesService } from "./categories.service"
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { GetUser } from "../auth/decorators"

@Controller("categories")
@ApiTags("Categories")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @ApiOperation({ summary: "Create a new category" })
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @GetUser("id") userId: string
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.create(createCategoryDto, userId)
    }

    @Get()
    @ApiOperation({ summary: "Get all categories" })
    @ApiQuery({
        name: "includeDeleted",
        required: false,
        type: Boolean,
        description: "Include deleted categories in the response"
    })
    async findAll(
        @Query("includeDeleted", new ParseBoolPipe({ optional: true }))
        includeDeleted = false
    ): Promise<CategoryResponseDto[]> {
        return this.categoriesService.findAll(includeDeleted)
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a category by ID" })
    @ApiQuery({
        name: "includeDeleted",
        required: false,
        type: Boolean,
        description: "Include deleted categories in the search"
    })
    async findOne(
        @Param("id") id: string,
        @Query("includeDeleted", new ParseBoolPipe({ optional: true }))
        includeDeleted = false
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.findOne(id, includeDeleted)
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a category" })
    async update(
        @Param("id") id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @GetUser("id") userId: string
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.update(id, updateCategoryDto, userId)
    }

    @Delete(":id")
    @ApiOperation({ summary: "Soft delete a category" })
    async remove(
        @Param("id") id: string,
        @GetUser("id") userId: string
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.remove(id, userId)
    }

    @Patch(":id/restore")
    @ApiOperation({ summary: "Restore a deleted category" })
    async restore(
        @Param("id") id: string,
        @GetUser("id") userId: string
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.restore(id, userId)
    }

    @Patch(":id/toggle-active")
    @ApiOperation({ summary: "Toggle category active status" })
    async toggleActive(
        @Param("id") id: string,
        @GetUser("id") userId: string
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.toggleActive(id, userId)
    }
}
