import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

// Admin accounts are never created through public registration —
// they're seeded directly or created by an existing admin. That's why
// this DTO only allows CANDIDATE / EMPLOYER, not the full Role enum.
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsIn(['CANDIDATE', 'EMPLOYER'])
  role: 'CANDIDATE' | 'EMPLOYER';

  @IsString()
  @MinLength(2)
  fullName: string;
}
