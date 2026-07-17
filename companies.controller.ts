import { Module } from '@nestjs/common';
import { AdminReportsController } from './admin-reports.controller';
import { AdminReportsService } from './admin-reports.service';
import { AuditLogService } from '../../common/audit-log.service';

@Module({
  controllers: [AdminReportsController],
  providers: [AdminReportsService, AuditLogService],
})
export class AdminReportsModule {}
