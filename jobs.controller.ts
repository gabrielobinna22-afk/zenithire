import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ReportStatus, ReportTargetType, Role } from '@prisma/client';
import { AdminReportsService } from './admin-reports.service';
import { ResolveReportDto } from './dto/resolve-report.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequestUser } from '../../auth/types/auth.types';

@Controller('admin/reports')
@Roles(Role.ADMIN)
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get()
  list(@Query('status') status?: ReportStatus, @Query('targetType') targetType?: ReportTargetType) {
    return this.adminReportsService.list(status, targetType);
  }

  @Patch(':id/reviewing')
  markReviewing(@CurrentUser() admin: RequestUser, @Param('id') id: string) {
    return this.adminReportsService.markReviewing(admin.id, id);
  }

  @Patch(':id/resolve')
  resolve(@CurrentUser() admin: RequestUser, @Param('id') id: string, @Body() dto: ResolveReportDto) {
    return this.adminReportsService.resolve(admin.id, id, dto);
  }
}
