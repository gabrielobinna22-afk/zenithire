import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type TaxonomyKind = 'category' | 'industry' | 'skill';
const VALID_KINDS: TaxonomyKind[] = ['category', 'industry', 'skill'];

@Injectable()
export class AdminCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // JobCategory, Industry, and Skill are all just { id, name } — rather
  // than three near-identical services, one dispatches to the right
  // Prisma delegate by kind. If any of the three grows extra fields later,
  // split it out into its own service at that point.
  private delegate(kind: TaxonomyKind) {
    if (!VALID_KINDS.includes(kind)) {
      throw new BadRequestException(`Unknown taxonomy kind: ${kind}`);
    }
    switch (kind) {
      case 'category':
        return this.prisma.jobCategory;
      case 'industry':
        return this.prisma.industry;
      case 'skill':
        return this.prisma.skill;
    }
  }

  async list(kind: TaxonomyKind) {
    return this.delegate(kind).findMany({ orderBy: { name: 'asc' } });
  }

  async create(kind: TaxonomyKind, name: string) {
    try {
      return await (this.delegate(kind) as any).create({ data: { name } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`"${name}" already exists`);
      }
      throw err;
    }
  }

  async remove(kind: TaxonomyKind, id: string) {
    try {
      return await (this.delegate(kind) as any).delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Not found');
      }
      // P2003: still referenced by jobs/candidates — deleting would either
      // fail or cascade unexpectedly depending on the relation, so surface
      // this clearly instead of letting Prisma's raw error leak through.
      throw err;
    }
  }
}
