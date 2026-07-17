import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminDashboardService } from './admin-dashboard.service';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/dashboard')
@Roles(Role.ADMIN)
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('overview')
  overview() {
    return this.dashboardService.overview();
  }

  @Get('signups')
  signups(@Query('days') days?: string) {
    return this.dashboardService.signupsOverTime(days ? parseInt(days, 10) : 30);
  }
}
