import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Deliberately just writes a row. Push/email fan-out (the "Notifications"
// requirement's email + push channels) belongs in a separate delivery
// worker that reads unread Notification rows — kept out of the request
// path so a slow email provider never blocks an API response.
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, type: NotificationType, title: string, body?: string, linkUrl?: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, body, linkUrl },
    });
  }
}
