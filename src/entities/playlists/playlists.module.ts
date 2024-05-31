import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './playlists.schema';
import { PlaylistResolver } from './playlists.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Playlist.name,
        useFactory: () => {
          const schema = PlaylistSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ]),
  ],
  providers: [PlaylistsService, PlaylistResolver],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
