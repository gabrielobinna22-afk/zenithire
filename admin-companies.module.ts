import { Module } from '@nestjs/common';
import { AdminJobsController } from './admin-jobs.controller';
import { AdminJobsService } from './admin-jobs.service';
import { AuditLogService } from '../../common/audit-log.service';

@Module({
  controllers: [AdminJobsController],
  providers: [AdminJobsService, AuditLogService],
})
export class AdminJobsModule {}
