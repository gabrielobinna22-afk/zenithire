import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';

import { NotificationsModule } from './notifications/notifications.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MessagingModule } from './messaging/messaging.module';

import { StorageModule } from './storage/storage.module';
import { VideosModule } from './videos/videos.module';

import { PaymentsModule } from './payments/payments.module';

import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';

import { CompaniesModule } from './companies/companies.module';
import { CandidatesModule } from './candidates/candidates.module';

import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Shared job-queue connection for the video-processing worker.
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
      },
    }),

    // JwtModule registered here with no default secret/options — every
    // module that signs or verifies a token (auth, the messaging
    // WebSocket gateway) passes its own secret and expiry explicitly at
    // call time, since access and refresh tokens use different secrets.
    JwtModule.register({ global: true }),

    PrismaModule,
    AuthModule,

    JobsModule,
    ApplicationsModule,
    SavedJobsModule,

    NotificationsModule,
    InvitationsModule,
    MessagingModule,

    StorageModule,
    VideosModule,

    PaymentsModule,

    AdminModule,
    ReportsModule,

    CompaniesModule,
    CandidatesModule,

    HealthModule,
  ],
  providers: [
    // Order matters: JwtAuthGuard runs first and populates request.user
    // (or waves through routes marked @Public()), then RolesGuard can
    // safely read request.user to check @Roles() restrictions.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
