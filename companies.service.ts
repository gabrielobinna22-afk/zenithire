import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalCandidates,
      totalEmployers,
      companiesPending,
      companiesVerified,
      jobsPublished,
      videosPendingReview,
      openReports,
      activeSubscriptions,
      paymentsThisMonth,
      applicationsTotal,
    ] = await this.prisma.$transaction([
      this.prisma.user.count({ where: { role: 'CANDIDATE' } }),
      this.prisma.user.count({ where: { role: 'EMPLOYER' } }),
      this.prisma.company.count({ where: { status: 'PENDING' } }),
      this.prisma.company.count({ where: { status: 'VERIFIED' } }),
      this.prisma.job.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.introVideo.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.report.count({ where: { status: 'OPEN' } }),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.application.count(),
    ]);

    return {
      users: { candidates: totalCandidates, employers: totalEmployers },
      companies: { pending: companiesPending, verified: companiesVerified },
      jobs: { published: jobsPublished },
      applications: { total: applicationsTotal },
      videos: { pendingReview: videosPendingReview },
      reports: { open: openReports },
      subscriptions: { active: activeSubscriptions },
      revenue: {
        thisMonthMinorUnits: paymentsThisMonth._sum.amount ?? 0,
        thisMonthTransactionCount: paymentsThisMonth._count,
      },
    };
  }

  async signupsOverTime(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Raw query for a simple daily bucket count — Prisma's query builder
    // doesn't have a native "group by day" for a DateTime column.
    return this.prisma.$queryRaw<{ day: string; signups: bigint }[]>`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS day, COUNT(*) AS signups
      FROM "User"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;
  }
}
