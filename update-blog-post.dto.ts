import { Module } from '@nestjs/common';
import { AdminCompaniesController } from './admin-companies.controller';
import { AdminCompaniesService } from './admin-companies.service';
import { AuditLogService } from '../../common/audit-log.service';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AdminCompaniesController],
  providers: [AdminCompaniesService, AuditLogService],
})
export class AdminCompaniesModule {}
