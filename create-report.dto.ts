import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Every admin action that changes state (suspend a user, verify a company,
// resolve a report...) should write one of these. It's the difference
// between "an admin can do this" and "we can prove who did it and when"
// if a decision is ever disputed.
@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    return this.prisma.auditLog.create({
      data: { actorId, action, targetType, targetId, metadata },
    });
  }
}
