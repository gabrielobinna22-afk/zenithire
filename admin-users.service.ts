import { IsString, MinLength } from 'class-validator';

export class RejectCompanyDto {
  @IsString()
  @MinLength(5)
  reason: string;
}
