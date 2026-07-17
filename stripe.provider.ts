import { BullModule } from '@nestjs/bullmq';

export const VIDEO_PROCESSING_QUEUE = 'video-processing';

export const VideoProcessingQueueModule = BullModule.registerQueue({
  name: VIDEO_PROCESSING_QUEUE,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500, // keep failures around for admin/debugging visibility
  },
});
