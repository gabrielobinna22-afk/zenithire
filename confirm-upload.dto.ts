import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  industryTag?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  // URL to a document already uploaded via the storage module's presigned
  // flow (CAC certificate, business registration, etc.) — same pattern
  // as video upload: the file goes straight to storage, this just records
  // where it landed.
  @IsOptional()
  @IsUrl()
  registrationDocUrl?: string;
}
