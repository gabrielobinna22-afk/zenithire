import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class InviteMemberDto {
  @IsEmail()
  email: string; // must already have an EMPLOYER account

  @IsOptional()
  @IsIn(['OWNER', 'RECRUITER'])
  role?: 'OWNER' | 'RECRUITER' = 'RECRUITER';
}
