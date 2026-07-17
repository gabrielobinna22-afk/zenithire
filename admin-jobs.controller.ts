import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

// Reuses the exact same AppModule as the API (same DI graph, same Prisma
// connection setup) but as a NestApplicationContext instead of an HTTP
// server — there's no reason for the video-processing worker to listen
// on a port. VideoProcessingProcessor registers itself with BullMQ purely
// through Nest's dependency injection once this context exists; nothing
// else needs to be called explicitly here.
async function bootstrap() {
  const logger = new Logger('Worker');
  await NestFactory.createApplicationContext(AppModule);
  logger.log('Video processing worker started, listening for jobs...');
}

bootstrap();
