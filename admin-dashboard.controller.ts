import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminCategoriesService, TaxonomyKind } from './admin-categories.service';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/taxonomy/:kind')
@Roles(Role.ADMIN)
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  @Get()
  list(@Param('kind') kind: TaxonomyKind) {
    return this.adminCategoriesService.list(kind);
  }

  @Post()
  create(@Param('kind') kind: TaxonomyKind, @Body() dto: CreateTaxonomyDto) {
    return this.adminCategoriesService.create(kind, dto.name);
  }

  @Delete(':id')
  remove(@Param('kind') kind: TaxonomyKind, @Param('id') id: string) {
    return this.adminCategoriesService.remove(kind, id);
  }
}
