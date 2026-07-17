import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../storage/storage.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { VIDEO_PROCESSING_QUEUE } from '../queues/video-processing.queue';
import { VideoStatus } from '@prisma/client';

// Hard ceiling with a small grace window — client-side trimming to exactly
// 60.00s isn't perfectly reliable, and rejecting a video at 60.4s over a
// rounding artifact would be an unnecessarily harsh candidate experience.
const MAX_DURATION_SECONDS = 63;

interface ProcessVideoJobData {
  videoId: string;
  storageKey: string;
}

@Processor(VIDEO_PROCESSING_QUEUE)
export class VideoProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<ProcessVideoJobData>): Promise<void> {
    const { videoId, storageKey } = job.data;
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zenith-video-'));
    const inputPath = path.join(workDir, 'original');
    const outputPath = path.join(workDir, 'compressed.mp4');
    const thumbnailPath = path.join(workDir, 'thumbnail.jpg');

    try {
      const originalBuffer = await this.storage.getObjectBuffer(storageKey);
      await fs.writeFile(inputPath, originalBuffer);

      const durationSecs = await this.probeDuration(inputPath);

      if (durationSecs > MAX_DURATION_SECONDS) {
        await this.markRejected(
          videoId,
          `Video is ${Math.round(durationSecs)}s — the platform limit is 60 seconds.`,
        );
        return;
      }

      await this.compress(inputPath, outputPath);
      await this.generateThumbnail(inputPath, thumbnailPath);

      const compressedBuffer = await fs.readFile(outputPath);
      const thumbnailBuffer = await fs.readFile(thumbnailPath);

      const candidate = await this.prisma.introVideo.findUnique({
        where: { id: videoId },
        select: { candidateId: true },
      });

      const playbackUrl = await this.storage.uploadBuffer(
        `intro-videos/${candidate.candidateId}/playback`,
        compressedBuffer,
        'video/mp4',
      );
      const thumbnailUrl = await this.storage.uploadBuffer(
        `intro-videos/${candidate.candidateId}/thumbnails`,
        thumbnailBuffer,
        'image/jpeg',
      );

      await this.prisma.introVideo.update({
        where: { id: videoId },
        data: {
          durationSecs: Math.round(durationSecs),
          playbackUrl,
          thumbnailUrl,
          status: VideoStatus.PENDING_REVIEW,
        },
      });
    } catch (err) {
      this.logger.error(`Video processing failed for ${videoId}`, err instanceof Error ? err.stack : err);
      await this.markRejected(videoId, 'We could not process this video. Please try uploading again.');
    } finally {
      await fs.rm(workDir, { recursive: true, force: true });
    }
  }

  private probeDuration(inputPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration ?? 0);
      });
    });
  }

  private compress(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size('?x720') // cap height at 720p, preserve aspect ratio
        .videoBitrate('1500k')
        .audioBitrate('128k')
        .outputOptions(['-movflags +faststart']) // enables streaming before full download completes
        .on('end', () => resolve())
        .on('error', reject)
        .save(outputPath);
    });
  }

  private generateThumbnail(inputPath: string, thumbnailPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['1'], // 1 second in — avoids a black first frame
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '480x?',
        })
        .on('end', () => resolve())
        .on('error', reject);
    });
  }

  private async markRejected(videoId: string, reason: string) {
    const video = await this.prisma.introVideo.update({
      where: { id: videoId },
      data: { status: VideoStatus.REJECTED, rejectionReason: reason, reviewedAt: new Date() },
      include: { candidate: { select: { userId: true } } },
    });
    await this.notifications.create(video.candidate.userId, 'VIDEO_REJECTED', 'Your video could not be used', reason);
  }
}
