import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { AuditLogService } from '../../common/audit-log.service';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AuditLogService],
})
export class AdminUsersModule {}
