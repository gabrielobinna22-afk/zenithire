import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { VideoStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { RejectVideoDto } from './dto/reject-video.dto';
import { VIDEO_PROCESSING_QUEUE } from './queues/video-processing.queue';

@Injectable()
export class VideosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationsService,
    @InjectQueue(VIDEO_PROCESSING_QUEUE) private readonly queue: Queue,
  ) {}

  private async getCandidateProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.candidateProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) throw new BadRequestException('Complete your candidate profile first');
    return profile.id;
  }

  async requestUploadUrl(userId: string, dto: RequestUploadUrlDto) {
    const candidateId = await this.getCandidateProfileId(userId);
    return this.storage.getPresignedUploadUrl(`intro-videos/${candidateId}/original`, dto.contentType);
  }

  async confirmUpload(userId: string, dto: ConfirmUploadDto) {
    const candidateId = await this.getCandidateProfileId(userId);

    const video = await this.prisma.introVideo.create({
      data: {
        candidateId,
        originalUrl: this.storage.getPublicUrl(dto.key),
        durationSecs: 0, // placeholder — the worker overwrites this with the ffprobe-measured value
        status: VideoStatus.PROCESSING,
      },
    });

    // Handed off immediately — compression and duration validation are
    // too slow to run in the request/response cycle. The candidate sees
    // status: PROCESSING until the worker finishes.
    await this.queue.add('process', { videoId: video.id, storageKey: dto.key });

    return video;
  }

  async myVideos(userId: string) {
    const candidateId = await this.getCandidateProfileId(userId);
    return this.prisma.introVideo.findMany({ where: { candidateId }, orderBy: { uploadedAt: 'desc' } });
  }

  // --- Admin moderation ----------------------------------------------------

  async listPendingReview() {
    return this.prisma.introVideo.findMany({
      where: { status: VideoStatus.PENDING_REVIEW },
      orderBy: { uploadedAt: 'asc' },
      include: { candidate: { select: { fullName: true, headline: true } } },
    });
  }

  async approve(adminUserId: string, videoId: string) {
    const video = await this.prisma.introVideo.findUnique({ where: { id: videoId } });
    if (!video) throw new NotFoundException('Video not found');
    if (video.status !== VideoStatus.PENDING_REVIEW) {
      throw new BadRequestException('Only videos pending review can be approved');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.introVideo.update({
        where: { id: videoId },
        data: { status: VideoStatus.APPROVED, reviewedAt: new Date(), reviewedById: adminUserId },
      }),
      // Approval is what actually makes it visible to employers — this is
      // the only place currentVideoId gets set, matching the "every video
      // goes through moderation before it's public" rule from the schema.
      this.prisma.candidateProfile.update({
        where: { id: video.candidateId },
        data: { currentVideoId: videoId },
      }),
    ]);

    const candidate = await this.prisma.candidateProfile.findUnique({ where: { id: video.candidateId } });
    await this.notifications.create(candidate.userId, 'VIDEO_APPROVED', 'Your introduction video was approved');

    return updated;
  }

  async reject(adminUserId: string, videoId: string, dto: RejectVideoDto) {
    const video = await this.prisma.introVideo.findUnique({ where: { id: videoId } });
    if (!video) throw new NotFoundException('Video not found');
    if (video.status !== VideoStatus.PENDING_REVIEW) {
      throw new BadRequestException('Only videos pending review can be rejected');
    }

    const updated = await this.prisma.introVideo.update({
      where: { id: videoId },
      data: {
        status: VideoStatus.REJECTED,
        rejectionReason: dto.reason,
        reviewedAt: new Date(),
        reviewedById: adminUserId,
      },
    });

    const candidate = await this.prisma.candidateProfile.findUnique({ where: { id: video.candidateId } });
    await this.notifications.create(candidate.userId, 'VIDEO_REJECTED', 'Your introduction video was rejected', dto.reason);

    return updated;
  }
}
