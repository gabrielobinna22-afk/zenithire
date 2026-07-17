import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Used anywhere an employer action needs to be scoped to "a company this
// user actually belongs to" — e.g. creating a job, viewing its applicants,
// updating application status. Centralized here so the ownership rule is
// defined once instead of re-implemented slightly differently per module.
@Injectable()
export class CompanyAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async assertMembership(userId: string, companyId: string): Promise<void> {
    const membership = await this.prisma.companyMember.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this company');
    }
  }

  /** Returns the company id a job belongs to, or throws if the job doesn't exist. */
  async assertJobOwnership(userId: string, jobId: string): Promise<string> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { companyId: true },
    });

    if (!job) {
      throw new ForbiddenException('Job not found or access denied');
    }

    await this.assertMembership(userId, job.companyId);
    return job.companyId;
  }
}
