import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { EmploymentType, WorkMode } from '@prisma/client';

export class CreateJobDto {
  @IsUUID()
  companyId: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(20, { message: 'Give candidates enough detail to decide if this role fits them' })
  description: string;

  @IsString()
  responsibilities: string;

  @IsString()
  requirements: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsEnum(WorkMode)
  workMode: WorkMode;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsUUID()
  industryId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds?: string[];
}
