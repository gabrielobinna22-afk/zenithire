import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/audit-log.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(role: Role, search?: string, page = 1, pageSize = 20) {
    const where = {
      role,
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { candidateProfile: { fullName: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          candidateProfile: { select: { fullName: true, headline: true } },
          companyMemberships: { select: { company: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  private async setStatus(adminId: string, userId: string, status: AccountStatus, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Admin accounts cannot be moderated through this endpoint');
    }

    const updated = await this.prisma.user.update({ where: { id: userId }, data: { status } });

    await this.auditLog.record(adminId, `USER_${status}`, 'User', userId, reason ? { reason } : undefined);

    if (status === AccountStatus.SUSPENDED || status === AccountStatus.BANNED) {
      await this.notifications.create(
        userId,
        'APPLICATION_UPDATE',
        `Your account has been ${status.toLowerCase()}`,
        reason,
      );
    }

    return updated;
  }

  suspend(adminId: string, userId: string, reason: string) {
    return this.setStatus(adminId, userId, AccountStatus.SUSPENDED, reason);
  }

  ban(adminId: string, userId: string, reason: string) {
    return this.setStatus(adminId, userId, AccountStatus.BANNED, reason);
  }

  reinstate(adminId: string, userId: string) {
    return this.setStatus(adminId, userId, AccountStatus.ACTIVE);
  }
}
