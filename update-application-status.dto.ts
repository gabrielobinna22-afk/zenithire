import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @MinLength(2)
  institution: string;

  @IsString()
  @MinLength(2)
  degree: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isOngoing?: boolean;
}

export class UpdateEducationDto {
  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isOngoing?: boolean;
}
