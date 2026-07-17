import { IsString, MinLength } from 'class-validator';

export class CreateCandidateProfileDto {
  @IsString()
  @MinLength(2)
  fullName: string;
}
