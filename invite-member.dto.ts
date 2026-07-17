import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus, ReportTargetType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/audit-log.service';
import { ResolveReportDto } from './dto/resolve-report.dto';

@Injectable()
export class AdminReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async list(status: ReportStatus = ReportStatus.OPEN, targetType?: ReportTargetType) {
    return this.prisma.report.findMany({
      where: { status, ...(targetType && { targetType }) },
      orderBy: { createdAt: 'asc' },
      include: { filedBy: { select: { email: true, role: true } } },
    });
  }

  async resolve(adminId: string, reportId: string, dto: ResolveReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');
    if (report.status !== ReportStatus.OPEN && report.status !== ReportStatus.REVIEWING) {
      throw new BadRequestException('This report has already been closed');
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: dto.status as ReportStatus,
        resolutionNote: dto.resolutionNote,
        resolvedById: adminId,
        resolvedAt: new Date(),
      },
    });

    await this.auditLog.record(adminId, `REPORT_${dto.status}`, 'Report', reportId, {
      targetType: report.targetType,
      targetId: report.targetId,
      note: dto.resolutionNote,
    });

    return updated;
  }

  async markReviewing(adminId: string, reportId: string) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.REVIEWING },
    });
  }
}
