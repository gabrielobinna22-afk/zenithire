import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/audit-log.service';

@Injectable()
export class AdminJobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async list(status?: JobStatus, page = 1, pageSize = 30) {
    const where = status ? { status } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({
        where,
        include: { company: { select: { name: true, status: true } }, _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.job.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  // Distinct from JobsService.close() in the employer-facing jobs module —
  // this bypasses the CompanyMember ownership check entirely, since an
  // admin acting on a reported/policy-violating job isn't required to be
  // a member of that company.
  async forceClose(adminId: string, jobId: string, reason: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const updated = await this.prisma.job.update({ where: { id: jobId }, data: { status: JobStatus.CLOSED } });
    await this.auditLog.record(adminId, 'JOB_FORCE_CLOSED', 'Job', jobId, { reason });
    return updated;
  }
}
