import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}
