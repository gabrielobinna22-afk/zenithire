import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CompanyStatus, Role } from '@prisma/client';
import { AdminCompaniesService } from './admin-companies.service';
import { RejectCompanyDto } from './dto/reject-company.dto';
import { ModerationReasonDto } from '../users/dto/moderation-reason.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequestUser } from '../../auth/types/auth.types';

@Controller('admin/companies')
@Roles(Role.ADMIN)
export class AdminCompaniesController {
  constructor(private readonly adminCompaniesService: AdminCompaniesService) {}

  @Get()
  listAll(@Query('status') status?: CompanyStatus) {
    return this.adminCompaniesService.listAll(status);
  }

  @Get('pending')
  listPending() {
    return this.adminCompaniesService.listPending();
  }

  @Post(':id/verify')
  verify(@CurrentUser() admin: RequestUser, @Param('id') id: string) {
    return this.adminCompaniesService.verify(admin.id, id);
  }

  @Post(':id/reject')
  reject(@CurrentUser() admin: RequestUser, @Param('id') id: string, @Body() dto: RejectCompanyDto) {
    return this.adminCompaniesService.reject(admin.id, id, dto.reason);
  }

  @Post(':id/suspend')
  suspend(@CurrentUser() admin: RequestUser, @Param('id') id: string, @Body() dto: ModerationReasonDto) {
    return this.adminCompaniesService.suspend(admin.id, id, dto.reason);
  }
}
