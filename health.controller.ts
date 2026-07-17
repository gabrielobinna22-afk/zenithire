import { IsString } from 'class-validator';

export class ConfirmUploadDto {
  // The storage key returned by /videos/upload-url — not client-editable
  // duration or approval data, since none of that is trustworthy from the
  // client. Real duration is measured server-side by ffprobe in the
  // processing worker.
  @IsString()
  key: string;
}
