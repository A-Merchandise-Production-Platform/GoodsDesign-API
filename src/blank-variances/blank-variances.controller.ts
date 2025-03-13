import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlankVariancesService } from './blank-variances.service';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('blank-variances')
@Controller('blank-variances')
export class BlankVariancesController {
  constructor(private readonly blankVariancesService: BlankVariancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blank variance' })
  @ApiResponse({ status: 201, description: 'The blank variance has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createBlankVarianceDto: Prisma.BlankVarianceCreateInput) {
    return this.blankVariancesService.create(createBlankVarianceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blank variances' })
  @ApiResponse({ status: 200, description: 'Return all blank variances.' })
  findAll() {
    return this.blankVariancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blank variance by ID' })
  @ApiResponse({ status: 200, description: 'Return the blank variance.' })
  @ApiResponse({ status: 404, description: 'Blank variance not found.' })
  findOne(@Param('id') id: string) {
    return this.blankVariancesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blank variance by ID' })
  @ApiResponse({ status: 200, description: 'The blank variance has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Blank variance not found.' })
  update(@Param('id') id: string, @Body() updateBlankVarianceDto: Prisma.BlankVarianceUpdateInput) {
    return this.blankVariancesService.update(id, updateBlankVarianceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blank variance by ID' })
  @ApiResponse({ status: 200, description: 'The blank variance has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Blank variance not found.' })
  remove(@Param('id') id: string) {
    return this.blankVariancesService.remove(id);
  }
}