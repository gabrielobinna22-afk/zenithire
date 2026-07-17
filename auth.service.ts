import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyAccessService } from '../common/company-access.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';

const PUBLIC_JOB_INCLUDE = {
  company: { select: { id: true, name: true, logoUrl: true, city: true, country: true, isFeatured: true } },
  skills: { include: { skill: true } },
  industry: true,
  category: true,
} satisfies Prisma.JobInclude;

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyAccess: CompanyAccessService,
  ) {}

  async create(userId: string, dto: CreateJobDto) {
    await this.companyAccess.assertMembership(userId, dto.companyId);

    const { skillIds, companyId, applicationDeadline, ...rest } = dto;

    return this.prisma.job.create({
      data: {
        ...rest,
        companyId,
        postedById: userId,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
        status: JobStatus.DRAFT,
        skills: skillIds?.length
          ? { create: skillIds.map((skillId) => ({ skillId })) }
          : undefined,
      },
      include: PUBLIC_JOB_INCLUDE,
    });
  }

  async update(userId: string, jobId: string, dto: UpdateJobDto) {
    await this.companyAccess.assertJobOwnership(userId, jobId);

    const { skillIds, applicationDeadline, ...rest } = dto;

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...rest,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
        // Full replace of the skill list keeps this idempotent — callers
        // send the complete desired set rather than a diff.
        skills: skillIds
          ? { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId })) }
          : undefined,
      },
      include: PUBLIC_JOB_INCLUDE,
    });
  }

  async publish(userId: string, jobId: string) {
    await this.companyAccess.assertJobOwnership(userId, jobId);
    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.PUBLISHED },
    });
  }

  async close(userId: string, jobId: string) {
    await this.companyAccess.assertJobOwnership(userId, jobId);
    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.CLOSED },
    });
  }

  async remove(userId: string, jobId: string) {
    await this.companyAccess.assertJobOwnership(userId, jobId);
    // Draft jobs with no applicants can be hard-deleted; anything published
    // keeps its history and gets closed instead, since applicants may be
    // relying on that job existing in their application history.
    const applicantCount = await this.prisma.application.count({ where: { jobId } });
    if (applicantCount === 0) {
      return this.prisma.job.delete({ where: { id: jobId } });
    }
    return this.close(userId, jobId);
  }

  async findOne(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: PUBLIC_JOB_INCLUDE,
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async findForCompany(userId: string, companyId: string) {
    await this.companyAccess.assertMembership(userId, companyId);
    return this.prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    });
  }

  async search(query: SearchJobsDto) {
    const { keyword, skills, city, country, employmentType, workMode, categoryId, industryId, salaryMin, page = 1, pageSize = 20 } = query;

    const where: Prisma.JobWhereInput = {
      status: JobStatus.PUBLISHED,
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
      ...(skills && {
        skills: { some: { skill: { name: { in: skills.split(',').map((s) => s.trim()) } } } },
      }),
      ...(city && { city: { equals: city, mode: 'insensitive' } }),
      ...(country && { country: { equals: country, mode: 'insensitive' } }),
      ...(employmentType && { employmentType }),
      ...(workMode && { workMode }),
      ...(categoryId && { categoryId }),
      ...(industryId && { industryId }),
      ...(salaryMin !== undefined && { salaryMax: { gte: salaryMin } }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({
        where,
        include: PUBLIC_JOB_INCLUDE,
        orderBy: [{ company: { isFeatured: 'desc' } }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.job.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}
