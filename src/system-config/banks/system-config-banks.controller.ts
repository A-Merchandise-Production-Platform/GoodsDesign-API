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
import { User } from '@prisma/client';

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
    @GetUser() user: User,
  ) {
    return this.banksService.create(createDto, user?.id);
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
  findOne(@Param('id', ParseIntPipe) id: string) {
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
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDto: UpdateSystemConfigBankDto,
    @GetUser() user: User,
  ) {
    return this.banksService.update(id, updateDto, user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a bank' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully deleted.',
    type: SystemConfigBankResponseDto,
  })
  remove(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.banksService.remove(id, user?.id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted bank' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully restored.',
    type: SystemConfigBankResponseDto,
  })
  restore(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.banksService.restore(id, user?.id);
  }
}