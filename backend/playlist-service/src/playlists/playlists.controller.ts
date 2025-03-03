import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilterPlaylistDto } from './dto/filter-playlist.dto';
import { SharePlaylistDto } from './dto/share-playlist.dto';

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req) {
    return this.playlistsService.create(createPlaylistDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.playlistsService.findAll(req.user.id);
  }

  @Get('filter')
  filter(@Query() filterDto: FilterPlaylistDto, @Request() req) {
    return this.playlistsService.filterPlaylists(filterDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.playlistsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto, @Request() req) {
    return this.playlistsService.update(id, updatePlaylistDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.playlistsService.remove(id, req.user.id);
  }

  @Post(':id/share')
  share(@Param('id') id: string, @Body() shareDto: SharePlaylistDto, @Request() req) {
    return this.playlistsService.sharePlaylist(id, shareDto, req.user.id);
  }
}
