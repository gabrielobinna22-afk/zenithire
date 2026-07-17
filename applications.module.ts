import { IsDateString, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;
}

export class UpdateCertificationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;
}
