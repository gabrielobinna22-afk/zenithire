import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl } from 'class-validator';
import { RegisterCompanyDto } from './register-company.dto';

export class UpdateCompanyDto extends PartialType(
  OmitType(RegisterCompanyDto, ['registrationDocUrl'] as const),
) {
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
