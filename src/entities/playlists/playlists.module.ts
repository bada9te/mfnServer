import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './playlists.schema';
import { PlaylistResolver } from './playlists.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Playlist.name, schema: PlaylistSchema }])
  ],
  providers: [PlaylistsService, PlaylistResolver]
})
export class PlaylistsModule {}
