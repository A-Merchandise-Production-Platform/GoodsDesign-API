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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiParam
} from "@nestjs/swagger"
import { ProductsService } from "./products.service"
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { GetUser } from "../auth/decorators"

@Controller("products")
@ApiTags("Products")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @ApiOperation({
        summary: "Create a new product",
        description:
            "Creates a new product with the provided data and associates it with a category"
    })
    @ApiResponse({
        status: 201,
        description: "The product has been successfully created",
        type: ProductResponseDto
    })
    @ApiResponse({ status: 400, description: "Bad Request - Invalid input data" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async create(
        @Body() createProductDto: CreateProductDto,
        @GetUser("id") userId: string
    ): Promise<ProductResponseDto> {
        return this.productsService.create(createProductDto, userId)
    }

    @Get()
    @ApiOperation({
        summary: "Get all products",
        description: "Retrieves a list of all products with optional inclusion of deleted items"
    })
    @ApiQuery({
        name: "includeDeleted",
        required: false,
        type: Boolean,
        description: "Include deleted products in the response"
    })
    @ApiResponse({
        status: 200,
        description: "List of products retrieved successfully",
        type: [ProductResponseDto]
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async findAll(
        @Query("includeDeleted", new ParseBoolPipe({ optional: true }))
        includeDeleted = false
    ): Promise<ProductResponseDto[]> {
        return this.productsService.findAll(includeDeleted)
    }

    @Get("category/:categoryId")
    @ApiOperation({
        summary: "Get all products by category ID",
        description: "Retrieves all products belonging to a specific category"
    })
    @ApiParam({
        name: "categoryId",
        description: "The unique identifier of the category",
        type: String
    })
    @ApiQuery({
        name: "includeDeleted",
        required: false,
        type: Boolean,
        description: "Include deleted products in the response"
    })
    @ApiResponse({
        status: 200,
        description: "List of products in the category retrieved successfully",
        type: [ProductResponseDto]
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async findByCategory(
        @Param("categoryId") categoryId: string,
        @Query("includeDeleted", new ParseBoolPipe({ optional: true }))
        includeDeleted = false
    ): Promise<ProductResponseDto[]> {
        return this.productsService.findByCategory(categoryId, includeDeleted)
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get a product by ID",
        description: "Retrieves a specific product by its unique identifier"
    })
    @ApiParam({
        name: "id",
        description: "The unique identifier of the product",
        type: String
    })
    @ApiQuery({
        name: "includeDeleted",
        required: false,
        type: Boolean,
        description: "Include deleted products in the search"
    })
    @ApiResponse({
        status: 200,
        description: "Product retrieved successfully",
        type: ProductResponseDto
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Product not found" })
    async findOne(
        @Param("id") id: string,
        @Query("includeDeleted", new ParseBoolPipe({ optional: true }))
        includeDeleted = false
    ): Promise<ProductResponseDto> {
        return this.productsService.findOne(id, includeDeleted)
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update a product",
        description: "Updates a product with the provided data"
    })
    @ApiParam({
        name: "id",
        description: "The unique identifier of the product to update",
        type: String
    })
    @ApiResponse({
        status: 200,
        description: "Product updated successfully",
        type: ProductResponseDto
    })
    @ApiResponse({ status: 400, description: "Bad Request - Invalid input data" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Product not found" })
    async update(
        @Param("id") id: string,
        @Body() updateProductDto: UpdateProductDto,
        @GetUser("id") userId: string
    ): Promise<ProductResponseDto> {
        return this.productsService.update(id, updateProductDto, userId)
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Soft delete a product",
        description: "Marks a product as deleted without removing it from the database"
    })
    @ApiParam({
        name: "id",
        description: "The unique identifier of the product to delete",
        type: String
    })
    @ApiResponse({
        status: 200,
        description: "Product soft deleted successfully",
        type: ProductResponseDto
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Product not found" })
    async remove(
        @Param("id") id: string,
        @GetUser("id") userId: string
    ): Promise<ProductResponseDto> {
        return this.productsService.remove(id, userId)
    }

    @Patch(":id/restore")
    @ApiOperation({
        summary: "Restore a deleted product",
        description: "Restores a previously soft-deleted product"
    })
    @ApiParam({
        name: "id",
        description: "The unique identifier of the product to restore",
        type: String
    })
    @ApiResponse({
        status: 200,
        description: "Product restored successfully",
        type: ProductResponseDto
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Product not found or not deleted" })
    async restore(
        @Param("id") id: string,
        @GetUser("id") userId: string
    ): Promise<ProductResponseDto> {
        return this.productsService.restore(id, userId)
    }

    @Patch(":id/toggle-active")
    @ApiOperation({
        summary: "Toggle product active status",
        description: "Toggles the active status of a product between active and inactive"
    })
    @ApiParam({
        name: "id",
        description: "The unique identifier of the product to toggle",
        type: String
    })
    @ApiResponse({
        status: 200,
        description: "Product active status toggled successfully",
        type: ProductResponseDto
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Product not found" })
    async toggleActive(
        @Param("id") id: string,
        @GetUser("id") userId: string
    ): Promise<ProductResponseDto> {
        return this.productsService.toggleActive(id, userId)
    }
}
