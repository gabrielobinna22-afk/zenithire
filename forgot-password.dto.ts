import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminAdsService } from './admin-ads.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/advertisements')
@Roles(Role.ADMIN)
export class AdminAdsController {
  constructor(private readonly adminAdsService: AdminAdsService) {}

  @Get()
  list(@Query('activeOnly') activeOnly?: string) {
    return this.adminAdsService.list(activeOnly === 'true');
  }

  @Post()
  create(@Body() dto: CreateAdvertisementDto) {
    return this.adminAdsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdvertisementDto) {
    return this.adminAdsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminAdsService.remove(id);
  }
}
