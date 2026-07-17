import { IsString, MinLength } from 'class-validator';

export class CreateTaxonomyDto {
  @IsString()
  @MinLength(2)
  name: string;
}
