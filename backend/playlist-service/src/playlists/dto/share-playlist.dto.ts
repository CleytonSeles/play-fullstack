import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class SharePlaylistDto {
  @IsNotEmpty()
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}
