import { IsIn } from 'class-validator';

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const;

export class RequestUploadUrlDto {
  @IsIn(ALLOWED_TYPES, { message: 'Only mp4, mov, or webm videos are accepted' })
  contentType: (typeof ALLOWED_TYPES)[number];
}
