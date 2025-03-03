import { Controller, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('playlists/:playlistId/videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  addVideoToPlaylist(
    @Param('playlistId') playlistId: string,
    @Body() createVideoDto: CreateVideoDto,
    @Request() req,
  ) {
    return this.videosService.addVideoToPlaylist(playlistId, createVideoDto, req.user.id);
  }

  @Delete(':id')
  removeVideoFromPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.videosService.removeVideoFromPlaylist(playlistId, id, req.user.id);
  }
}
