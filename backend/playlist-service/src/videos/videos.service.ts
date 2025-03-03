import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { PlaylistsService } from '../playlists/playlists.service';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private playlistsService: PlaylistsService,
  ) {}

  async addVideoToPlaylist(playlistId: string, createVideoDto: CreateVideoDto, userId: string): Promise<Video> {
    // Verifica se o usuário tem acesso à playlist
    const playlist = await this.playlistsService.findOne(playlistId, userId);
    
    // Verifica se o usuário é o proprietário da playlist
    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only add videos to your own playlists');
    }
    
    const video = this.videosRepository.create({
      ...createVideoDto,
      playlistId,
    });
    
    return this.videosRepository.save(video);
  }

  async removeVideoFromPlaylist(playlistId: string, videoId: string, userId: string): Promise<void> {
    // Verifica se o usuário tem acesso à playlist
    const playlist = await this.playlistsService.findOne(playlistId, userId);
    
    // Verifica se o usuário é o proprietário da playlist
    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only remove videos from your own playlists');
    }
    
    const video = await this.videosRepository.findOne({
      where: { id: videoId, playlistId },
    });
    
    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found in playlist ${playlistId}`);
    }
    
    await this.videosRepository.remove(video);
  }
}
