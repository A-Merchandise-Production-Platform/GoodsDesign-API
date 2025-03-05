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
import { SystemConfigBanksService } from './system-config-banks.service';
import {
  CreateSystemConfigBankDto,
  UpdateSystemConfigBankDto,
  SystemConfigBankResponseDto,
} from './dto/system-config-bank.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators';

@ApiTags('System Config Banks')
@Controller('system-config/banks')
@ApiBearerAuth()
export class SystemConfigBanksController {
  constructor(private readonly banksService: SystemConfigBanksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank' })
  @ApiResponse({
    status: 201,
    description: 'The bank has been successfully created.',
    type: SystemConfigBankResponseDto,
  })
  create(
    @Body() createDto: CreateSystemConfigBankDto,
    @GetUser('id') userId: string,
  ) {
    return this.banksService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted banks in the results',
  })
  @ApiResponse({
    status: 200,
    description: 'List of banks retrieved successfully.',
    type: [SystemConfigBankResponseDto],
  })
  findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return this.banksService.findAll(includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bank by id' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been found.',
    type: SystemConfigBankResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bank' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully updated.',
    type: SystemConfigBankResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSystemConfigBankDto,
    @GetUser('id') userId: string,
  ) {
    return this.banksService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a bank' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully deleted.',
    type: SystemConfigBankResponseDto,
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
  ) {
    return this.banksService.remove(id, userId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted bank' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully restored.',
    type: SystemConfigBankResponseDto,
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
  ) {
    return this.banksService.restore(id, userId);
  }
}