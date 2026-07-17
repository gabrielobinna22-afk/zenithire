import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from './dto/work-experience.dto';
import { CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';
import { SetIndustriesDto, SetSkillsDto } from './dto/taxonomy-selection.dto';

// Weights sum to 100. Each represents a piece of the profile that
// materially helps an employer decide whether to invite this candidate —
// not just "did they fill in a text box".
const COMPLETION_WEIGHTS = {
  photo: 10,
  cv: 10,
  bio: 10,
  education: 15,
  experience: 15,
  skills: 10,
  industries: 10,
  video: 15,
  salary: 5,
};

const PROFILE_INCLUDE = {
  education: true,
  workExperience: true,
  certifications: true,
  skills: { include: { skill: true } },
  industries: { include: { industry: true } },
  currentVideo: true,
} as const;

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateCandidateProfileDto) {
    try {
      return await this.prisma.candidateProfile.create({
        data: { userId, fullName: dto.fullName },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('Candidate profile already exists');
      }
      throw err;
    }
  }

  async me(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: PROFILE_INCLUDE,
    });
    if (!profile) throw new NotFoundException('Candidate profile not found — create one first');
    return profile;
  }

  private async getProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.candidateProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) throw new NotFoundException('Candidate profile not found — create one first');
    return profile.id;
  }

  async update(userId: string, dto: UpdateCandidateProfileDto) {
    const candidateId = await this.getProfileId(userId);
    await this.prisma.candidateProfile.update({ where: { id: candidateId }, data: dto });
    return this.recomputeCompletion(candidateId);
  }

  // --- Education -------------------------------------------------------------

  async addEducation(userId: string, dto: CreateEducationDto) {
    const candidateId = await this.getProfileId(userId);
    await this.prisma.education.create({
      data: { ...dto, candidateId, startDate: new Date(dto.startDate), endDate: dto.endDate ? new Date(dto.endDate) : undefined },
    });
    return this.recomputeCompletion(candidateId);
  }

  async updateEducation(userId: string, educationId: string, dto: UpdateEducationDto) {
    const candidateId = await this.getProfileId(userId);
    await this.assertOwned('education', educationId, candidateId);
    const { startDate, endDate, ...rest } = dto;
    await this.prisma.education.update({
      where: { id: educationId },
      data: { ...rest, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }) },
    });
    return this.recomputeCompletion(candidateId);
  }

  async removeEducation(userId: string, educationId: string) {
    const candidateId = await this.getProfileId(userId);
    await this.assertOwned('education', educationId, candidateId);
    await this.prisma.education.delete({ where: { id: educationId } });
    return this.recomputeCompletion(candidateId);
  }

  // --- Work experience ---------------------------------------------------------

  async addExperience(userId: string, dto: CreateWorkExperienceDto) {
    const candidateId = await this.getProfileId(userId);
    await this.prisma.workExperience.create({
      data: { ...dto, candidateId, startDate: new Date(dto.startDate), endDate: dto.endDate ? new Date(dto.endDate) : undefined },
    });
    return this.recomputeCompletion(candidateId);
  }

  async updateExperience(userId: string, experienceId: string, dto: UpdateWorkExperienceDto) {
    const candidateId = await this.getProfileId(userId);
    await this.assertOwned('workExperience', experienceId, candidateId);
    const { startDate, endDate, ...rest } = dto;
    await this.prisma.workExperience.update({
      where: { id: experienceId },
      data: { ...rest, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }) },
    });
    return this.recomputeCompletion(candidateId);
  }

  async removeExperience(userId: string, experienceId: string) {
    const candidateId = await this.getProfileId(userId);
    await this.assertOwned('workExperience', experienceId, candidateId);
    await this.prisma.workExperience.delete({ where: { id: experienceId } });
    return this.recomputeCompletion(candidateId);
  }

  // --- Certifications ----------------------------------------------------------

  async addCertification(userId: string, dto: CreateCertificationDto) {
    const candidateId = await this.getProfileId(userId);
    await this.prisma.certification.create({
      data: {
        ...dto,
        candidateId,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
    return this.recomputeCompletion(candidateId);
  }

  async updateCertification(userId: string, certificationId: string, dto: UpdateCertificationDto) {
    const candidateId = await this.getProfileId(userId);
    await this.assertOwned('certification', certificationId, candidateId);
    const { issuedAt, expiresAt, ...rest } = dto;
    await this.prisma.certification.update({
      where: { id: certificationId },
      data: { ...rest, ...(issuedAt && { issuedAt: new Date(issuedAt) }), ...(expiresAt && { expiresAt: new Date(expiresAt) }) },
    });
    return this.recomputeCompletion(candidateId);
  }

  async removeCertification(userId: string, certificationId: string) {
    const candidateId = await this.getProfileId(userId);
    await this.assertOwned('certification', certificationId, candidateId);
    await this.prisma.certification.delete({ where: { id: certificationId } });
    return this.recomputeCompletion(candidateId);
  }

  // --- Skills / Industries (full-replace, upserting lookup rows) ---------------

  async setSkills(userId: string, dto: SetSkillsDto) {
    const candidateId = await this.getProfileId(userId);
    const skillIds = await Promise.all(
      dto.skills.map(async (name) => {
        const skill = await this.prisma.skill.upsert({ where: { name }, create: { name }, update: {} });
        return skill.id;
      }),
    );

    await this.prisma.$transaction([
      this.prisma.candidateSkill.deleteMany({ where: { candidateId } }),
      this.prisma.candidateSkill.createMany({
        data: skillIds.map((skillId) => ({ candidateId, skillId })),
        skipDuplicates: true,
      }),
    ]);

    return this.recomputeCompletion(candidateId);
  }

  async setIndustries(userId: string, dto: SetIndustriesDto) {
    const candidateId = await this.getProfileId(userId);
    const industryIds = await Promise.all(
      dto.industries.map(async (name) => {
        const industry = await this.prisma.industry.upsert({ where: { name }, create: { name }, update: {} });
        return industry.id;
      }),
    );

    await this.prisma.$transaction([
      this.prisma.candidateIndustry.deleteMany({ where: { candidateId } }),
      this.prisma.candidateIndustry.createMany({
        data: industryIds.map((industryId) => ({ candidateId, industryId })),
        skipDuplicates: true,
      }),
    ]);

    return this.recomputeCompletion(candidateId);
  }

  // --- Internals -----------------------------------------------------------

  private async assertOwned(
    model: 'education' | 'workExperience' | 'certification',
    recordId: string,
    candidateId: string,
  ) {
    const record = await (this.prisma[model] as any).findUnique({ where: { id: recordId } });
    if (!record || record.candidateId !== candidateId) {
      throw new NotFoundException('Record not found');
    }
  }

  // Recalculates and persists profile completion after every mutation, so
  // the dashboard's completion ring is never stale — the candidate never
  // has to explicitly ask for it to be recomputed, it just always
  // reflects the current state after any save.
  private async recomputeCompletion(candidateId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { id: candidateId },
      include: {
        education: true,
        workExperience: true,
        skills: true,
        industries: true,
      },
    });
    if (!profile) throw new NotFoundException('Candidate profile not found');

    let score = 0;
    if (profile.photoUrl) score += COMPLETION_WEIGHTS.photo;
    if (profile.cvUrl) score += COMPLETION_WEIGHTS.cv;
    if (profile.bio && profile.bio.length > 20) score += COMPLETION_WEIGHTS.bio;
    if (profile.education.length > 0) score += COMPLETION_WEIGHTS.education;
    if (profile.workExperience.length > 0) score += COMPLETION_WEIGHTS.experience;
    if (profile.skills.length > 0) score += COMPLETION_WEIGHTS.skills;
    if (profile.industries.length > 0) score += COMPLETION_WEIGHTS.industries;
    if (profile.currentVideoId) score += COMPLETION_WEIGHTS.video;
    if (profile.expectedSalaryMin && profile.expectedSalaryMax) score += COMPLETION_WEIGHTS.salary;

    return this.prisma.candidateProfile.update({
      where: { id: candidateId },
      data: { profileCompletion: score },
      include: PROFILE_INCLUDE,
    });
  }
}
