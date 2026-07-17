import { IsBoolean, IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAdvertisementDto {
  @IsString()
  title: string;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  targetUrl: string;

  @IsString()
  placement: string; // e.g. "HOME_HERO_BANNER", "SEARCH_SIDEBAR"

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
