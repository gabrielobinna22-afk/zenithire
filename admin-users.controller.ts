import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/audit-log.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class AdminCompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly notifications: NotificationsService,
  ) {}

  async listPending() {
    return this.prisma.company.findMany({
      where: { status: CompanyStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      include: { members: { where: { role: 'OWNER' }, include: { user: { select: { email: true } } } } },
    });
  }

  async listAll(status?: CompanyStatus) {
    return this.prisma.company.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { jobs: true, members: true } } },
    });
  }


  private async ownerUserId(companyId: string): Promise<string | null> {
    const owner = await this.prisma.companyMember.findFirst({
      where: { companyId, role: 'OWNER' },
      select: { userId: true },
    });
    return owner?.userId ?? null;
  }

  async verify(adminId: string, companyId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    if (company.status !== CompanyStatus.PENDING) {
      throw new BadRequestException('Only pending companies can be verified');
    }

    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.VERIFIED, rejectionReason: null },
    });

    await this.auditLog.record(adminId, 'COMPANY_VERIFIED', 'Company', companyId);

    const ownerId = await this.ownerUserId(companyId);
    if (ownerId) {
      await this.notifications.create(ownerId, 'COMPANY_VERIFIED', 'Your company has been verified', company.name);
    }

    return updated;
  }

  async reject(adminId: string, companyId: string, reason: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    if (company.status !== CompanyStatus.PENDING) {
      throw new BadRequestException('Only pending companies can be rejected');
    }

    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.REJECTED, rejectionReason: reason },
    });

    await this.auditLog.record(adminId, 'COMPANY_REJECTED', 'Company', companyId, { reason });

    const ownerId = await this.ownerUserId(companyId);
    if (ownerId) {
      await this.notifications.create(ownerId, 'APPLICATION_UPDATE', 'Your company verification was rejected', reason);
    }

    return updated;
  }

  async suspend(adminId: string, companyId: string, reason: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.SUSPENDED },
    });

    await this.auditLog.record(adminId, 'COMPANY_SUSPENDED', 'Company', companyId, { reason });
    return updated;
  }
}
