import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from './entities/video.entity';
import { PlaylistsModule } from '../playlists/playlists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    forwardRef(() => PlaylistsModule),
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
