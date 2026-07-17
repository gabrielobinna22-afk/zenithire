import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async register(userId: string, dto: RegisterCompanyDto) {
    const baseSlug = this.slugify(dto.name);
    let slug = baseSlug;
    let attempt = 0;

    // Retry with a numeric suffix on collision rather than failing the
    // registration outright — "Northbridge Capital" already existing as
    // a slug shouldn't block a second, unrelated company with the same
    // display name from registering.
    while (await this.prisma.company.findUnique({ where: { slug } })) {
      attempt += 1;
      slug = `${baseSlug}-${attempt}`;
      if (attempt > 20) throw new ConflictException('Could not generate a unique company identifier');
    }

    const { registrationDocUrl, ...rest } = dto;

    const company = await this.prisma.company.create({
      data: {
        ...rest,
        slug,
        registrationDocUrl,
        members: { create: { userId, role: 'OWNER' } },
      },
    });

    return company;
  }

  async myCompany(userId: string) {
    const membership = await this.prisma.companyMember.findFirst({
      where: { userId },
      include: { company: true },
      orderBy: { joinedAt: 'asc' },
    });
    if (!membership) throw new NotFoundException('You have not registered or joined a company yet');
    return { ...membership.company, myRole: membership.role };
  }

  private async assertRole(userId: string, companyId: string, roles: ('OWNER' | 'RECRUITER')[]) {
    const membership = await this.prisma.companyMember.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    if (!membership || !roles.includes(membership.role)) {
      throw new ForbiddenException('You do not have permission to do this');
    }
    return membership;
  }

  async update(userId: string, companyId: string, dto: UpdateCompanyDto) {
    // Profile edits (name, description, logo) are OWNER-only — a recruiter
    // added to help manage job postings shouldn't be able to rebrand the
    // company or swap its logo.
    await this.assertRole(userId, companyId, ['OWNER']);

    try {
      return await this.prisma.company.update({ where: { id: companyId }, data: dto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Company not found');
      }
      throw err;
    }
  }

  async listMembers(userId: string, companyId: string) {
    await this.assertRole(userId, companyId, ['OWNER', 'RECRUITER']);
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: { select: { id: true, email: true, status: true } } },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async inviteMember(ownerId: string, companyId: string, dto: InviteMemberDto) {
    await this.assertRole(ownerId, companyId, ['OWNER']);

    const invitee = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!invitee || invitee.role !== Role.EMPLOYER) {
      throw new BadRequestException('This email is not registered as an employer account');
    }

    try {
      const member = await this.prisma.companyMember.create({
        data: { userId: invitee.id, companyId, role: dto.role ?? 'RECRUITER' },
      });

      const company = await this.prisma.company.findUnique({ where: { id: companyId } });
      await this.notifications.create(
        invitee.id,
        'COMPANY_VERIFIED', // reusing the closest existing notification type; a dedicated TEAM_INVITE type is a small schema addition if this needs to read differently
        `You've been added to ${company.name}`,
        `Role: ${dto.role ?? 'RECRUITER'}`,
      );

      return member;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('This person is already part of the company');
      }
      throw err;
    }
  }

  async removeMember(ownerId: string, companyId: string, memberUserId: string) {
    await this.assertRole(ownerId, companyId, ['OWNER']);

    if (memberUserId === ownerId) {
      const ownerCount = await this.prisma.companyMember.count({ where: { companyId, role: 'OWNER' } });
      if (ownerCount <= 1) {
        throw new BadRequestException('A company must keep at least one owner — promote someone else first');
      }
    }

    await this.prisma.companyMember.delete({
      where: { userId_companyId: { userId: memberUserId, companyId } },
    });
    return { removed: true };
  }
}
