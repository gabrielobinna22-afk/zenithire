import { IsIn, IsOptional, IsString } from 'class-validator';

export class ResolveReportDto {
  @IsIn(['RESOLVED', 'DISMISSED'])
  status: 'RESOLVED' | 'DISMISSED';

  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
