import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideoProcessingProcessor } from './processors/video-processing.processor';
import { VideoProcessingQueueModule } from './queues/video-processing.queue';
import { StorageModule } from '../storage/storage.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [VideoProcessingQueueModule, StorageModule, NotificationsModule],
  controllers: [VideosController],
  providers: [VideosService, VideoProcessingProcessor],
  exports: [VideosService],
})
export class VideosModule {}
