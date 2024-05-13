import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from './playlists.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlaylistsService {
    constructor(@InjectModel(Playlist.name) private playlistsModel: Model<Playlist>) {}
    
}
