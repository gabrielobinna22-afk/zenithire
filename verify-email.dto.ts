import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';

@Injectable()
export class AdminAdsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(activeOnly = false) {
    const now = new Date();
    return this.prisma.advertisement.findMany({
      where: activeOnly ? { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } } : undefined,
      orderBy: { startsAt: 'desc' },
    });
  }

  create(dto: CreateAdvertisementDto) {
    return this.prisma.advertisement.create({
      data: { ...dto, startsAt: new Date(dto.startsAt), endsAt: new Date(dto.endsAt) },
    });
  }

  async update(id: string, dto: UpdateAdvertisementDto) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Advertisement not found');

    const { startsAt, endsAt, ...rest } = dto;
    return this.prisma.advertisement.update({
      where: { id },
      data: {
        ...rest,
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt && { endsAt: new Date(endsAt) }),
      },
    });
  }

  async remove(id: string) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Advertisement not found');
    return this.prisma.advertisement.delete({ where: { id } });
  }

  // Called by whatever public-facing endpoint actually renders an ad slot —
  // impressions/clicks are cheap counters, not something worth an audit
  // log entry (unlike everything else in this admin surface).
  async recordImpression(id: string) {
    await this.prisma.advertisement.update({ where: { id }, data: { impressions: { increment: 1 } } });
  }

  async recordClick(id: string) {
    await this.prisma.advertisement.update({ where: { id }, data: { clicks: { increment: 1 } } });
  }
}
