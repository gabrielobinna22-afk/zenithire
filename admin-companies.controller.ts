import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JobStatus, Role } from '@prisma/client';
import { AdminJobsService } from './admin-jobs.service';
import { ModerationReasonDto } from '../users/dto/moderation-reason.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequestUser } from '../../auth/types/auth.types';

@Controller('admin/jobs')
@Roles(Role.ADMIN)
export class AdminJobsController {
  constructor(private readonly adminJobsService: AdminJobsService) {}

  @Get()
  list(@Query('status') status?: JobStatus, @Query('page') page?: string) {
    return this.adminJobsService.list(status, page ? +page : 1);
  }

  @Post(':id/force-close')
  forceClose(@CurrentUser() admin: RequestUser, @Param('id') id: string, @Body() dto: ModerationReasonDto) {
    return this.adminJobsService.forceClose(admin.id, id, dto.reason);
  }
}
