import { IsArray, IsOptional, IsString } from 'class-validator';

export class FilterPlaylistDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
