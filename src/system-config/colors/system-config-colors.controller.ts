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
import { SystemConfigColorsService } from './system-config-colors.service';
import {
  CreateSystemConfigColorDto,
  UpdateSystemConfigColorDto,
  SystemConfigColorResponseDto,
} from './dto/system-config-color.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators';
import { User } from '@prisma/client';

@ApiTags('System Config Colors')
@Controller('system-config/colors')
@ApiBearerAuth()
export class SystemConfigColorsController {
  constructor(private readonly colorsService: SystemConfigColorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new color' })
  @ApiResponse({
    status: 201,
    description: 'The color has been successfully created.',
    type: SystemConfigColorResponseDto,
  })
  create(
    @Body() createDto: CreateSystemConfigColorDto,
    @GetUser() user: User,
  ) {
    return this.colorsService.create(createDto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all colors' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted colors in the results',
  })
  @ApiResponse({
    status: 200,
    description: 'List of colors retrieved successfully.',
    type: [SystemConfigColorResponseDto],
  })
  findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return this.colorsService.findAll(includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a color by id' })
  @ApiResponse({
    status: 200,
    description: 'The color has been found.',
    type: SystemConfigColorResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.colorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a color' })
  @ApiResponse({
    status: 200,
    description: 'The color has been successfully updated.',
    type: SystemConfigColorResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDto: UpdateSystemConfigColorDto,
    @GetUser() user: User,
  ) {
    return this.colorsService.update(id, updateDto, user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a color' })
  @ApiResponse({
    status: 200,
    description: 'The color has been successfully deleted.',
    type: SystemConfigColorResponseDto,
  })
  remove(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.colorsService.remove(id, user?.id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted color' })
  @ApiResponse({
    status: 200,
    description: 'The color has been successfully restored.',
    type: SystemConfigColorResponseDto,
  })
  restore(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.colorsService.restore(id, user?.id);
  }
}