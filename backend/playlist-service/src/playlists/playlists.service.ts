import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FilterPlaylistDto } from './dto/filter-playlist.dto';
import { SharePlaylistDto } from './dto/share-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: string): Promise<Playlist> {
    const playlist = this.playlistsRepository.create({
      ...createPlaylistDto,
      userId,
    });

    return this.playlistsRepository.save(playlist);
  }

  async findAll(userId: string): Promise<Playlist[]> {
    return this.playlistsRepository.find({
      where: [
        { userId },
        { sharedWith: userId },
        { isPublic: true },
      ],
      relations: ['videos'],
    });
  }

  async findOne(id: string, userId: string): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    // Verifica se o usuário tem acesso à playlist
    if (
      playlist.userId !== userId && 
      !playlist.isPublic && 
      (!playlist.sharedWith || !playlist.sharedWith.includes(userId))
    ) {
      throw new ForbiddenException('You do not have access to this playlist');
    }

    return playlist;
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto, userId: string): Promise<Playlist> {
    const playlist = await this.findOne(id, userId);

    // Verifica se o usuário é o proprietário
    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only update your own playlists');
    }

    await this.playlistsRepository.update(id, updatePlaylistDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const playlist = await this.findOne(id, userId);

    // Verifica se o usuário é o proprietário
    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only delete your own playlists');
    }

    await this.playlistsRepository.remove(playlist);
  }

  async filterPlaylists(filterDto: FilterPlaylistDto, userId: string): Promise<Playlist[]> {
    const { category, tags } = filterDto;
    const query = this.playlistsRepository.createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.videos', 'videos')
      .where('(playlist.userId = :userId OR playlist.isPublic = :isPublic)', { userId, isPublic: true });

    if (category) {
      query.andWhere('playlist.category = :category', { category });
    }

    if (tags && tags.length > 0) {
      for (const tag of tags) {
        query.andWhere('playlist.tags LIKE :tag', { tag: `%${tag}%` });
      }
    }

    return query.getMany();
  }

  async sharePlaylist(id: string, shareDto: SharePlaylistDto, userId: string): Promise<Playlist> {
    const playlist = await this.findOne(id, userId);

    // Verifica se o usuário é o proprietário
    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only share your own playlists');
    }

    // Adiciona os emails à lista de compartilhamentos
    if (!playlist.sharedWith) {
      playlist.sharedWith = [];
    }
    
    // Adiciona apenas emails únicos
    shareDto.emails.forEach(email => {
      if (!playlist.sharedWith.includes(email)) {
        playlist.sharedWith.push(email);
      }
    });

    return this.playlistsRepository.save(playlist);
  }
}
