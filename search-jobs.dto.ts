import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/audit-log.service';

// Deliberately just strings — a flat key/value store for platform-wide
// toggles and copy (maintenance mode, featured-placement pricing text,
// support contact email, etc.) that shouldn't need a code deploy to
// change. Structured config belongs in environment variables instead;
// this is for things a non-engineer admin should be able to edit.
@Injectable()
export class AdminSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async list() {
    return this.prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async get(key: string) {
    return this.prisma.systemSetting.findUnique({ where: { key } });
  }

  async set(adminId: string, key: string, value: string) {
    const updated = await this.prisma.systemSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    await this.auditLog.record(adminId, 'SETTING_UPDATED', 'SystemSetting', key, { value });
    return updated;
  }

  async remove(adminId: string, key: string) {
    await this.prisma.systemSetting.delete({ where: { key } });
    await this.auditLog.record(adminId, 'SETTING_DELETED', 'SystemSetting', key);
    return { deleted: true };
  }
}
