import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './playlists.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Playlist.name, schema: PlaylistSchema }])
  ],
  providers: [PlaylistsService]
})
export class PlaylistsModule {}
