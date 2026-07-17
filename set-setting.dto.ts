import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  @MinLength(20)
  content: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}
