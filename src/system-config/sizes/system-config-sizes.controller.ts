import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SystemConfigSizesService } from './system-config-sizes.service';
import {
  CreateSystemConfigSizeDto,
  UpdateSystemConfigSizeDto,
  SystemConfigSizeResponseDto,
} from './dto/system-config-size.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators';

@ApiTags('System Config Sizes')
@Controller('system-config/sizes')
@ApiBearerAuth()
export class SystemConfigSizesController {
  constructor(private readonly sizesService: SystemConfigSizesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({
    status: 201,
    description: 'The size has been successfully created.',
    type: SystemConfigSizeResponseDto,
  })
  create(
    @Body() createDto: CreateSystemConfigSizeDto,
    @GetUser('id') userId: string,
  ) {
    return this.sizesService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted sizes in the results',
  })
  @ApiResponse({
    status: 200,
    description: 'List of sizes retrieved successfully.',
    type: [SystemConfigSizeResponseDto],
  })
  findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return this.sizesService.findAll(includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a size by id' })
  @ApiResponse({
    status: 200,
    description: 'The size has been found.',
    type: SystemConfigSizeResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.sizesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a size' })
  @ApiResponse({
    status: 200,
    description: 'The size has been successfully updated.',
    type: SystemConfigSizeResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDto: UpdateSystemConfigSizeDto,
    @GetUser('id') userId: string,
  ) {
    return this.sizesService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a size' })
  @ApiResponse({
    status: 200,
    description: 'The size has been successfully deleted.',
    type: SystemConfigSizeResponseDto,
  })
  remove(
    @Param('id', ParseIntPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.sizesService.remove(id, userId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted size' })
  @ApiResponse({
    status: 200,
    description: 'The size has been successfully restored.',
    type: SystemConfigSizeResponseDto,
  })
  restore(
    @Param('id', ParseIntPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.sizesService.restore(id, userId);
  }
}