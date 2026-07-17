import { ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class SetSkillsDto {
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  skills: string[]; // skill names — created if they don't already exist
}

export class SetIndustriesDto {
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  industries: string[]; // industry names — created if they don't already exist
}
