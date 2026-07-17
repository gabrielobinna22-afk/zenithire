import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { VideosService } from './videos.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { RejectVideoDto } from './dto/reject-video.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types/auth.types';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // --- Candidate upload flow ------------------------------------------------

  @Roles(Role.CANDIDATE)
  @Post('upload-url')
  requestUploadUrl(@CurrentUser() user: RequestUser, @Body() dto: RequestUploadUrlDto) {
    return this.videosService.requestUploadUrl(user.id, dto);
  }

  @Roles(Role.CANDIDATE)
  @Post('confirm')
  confirmUpload(@CurrentUser() user: RequestUser, @Body() dto: ConfirmUploadDto) {
    return this.videosService.confirmUpload(user.id, dto);
  }

  @Roles(Role.CANDIDATE)
  @Get('me')
  myVideos(@CurrentUser() user: RequestUser) {
    return this.videosService.myVideos(user.id);
  }

  // --- Admin moderation ------------------------------------------------------

  @Roles(Role.ADMIN)
  @Get('admin/pending')
  listPendingReview() {
    return this.videosService.listPendingReview();
  }

  @Roles(Role.ADMIN)
  @Post('admin/:id/approve')
  approve(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.videosService.approve(user.id, id);
  }

  @Roles(Role.ADMIN)
  @Post('admin/:id/reject')
  reject(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: RejectVideoDto) {
    return this.videosService.reject(user.id, id, dto);
  }
}
