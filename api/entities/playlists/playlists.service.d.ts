import { Playlist } from './playlists.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePlaylistDto } from './dto';
import { RangeDto } from 'src/common/dto';
export declare class PlaylistsService {
    private playlistsModel;
    constructor(playlistsModel: Model<Playlist>);
    getPlaylistById(_id: string): Promise<mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    createPlaylist(playlist: CreatePlaylistDto): Promise<mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deletePlaylistById(_id: string): Promise<mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    swicthTrackInPlaylist(playlistId: string, trackId: string): Promise<mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getPlaylistByTitle(title: string): Promise<(mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getPlaylistByOwnerId(ownerId: string, range: RangeDto): Promise<(mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getPublicAvailablePlaylists(range: RangeDto): Promise<(mongoose.Document<unknown, {}, Playlist> & Playlist & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getDocsCount(filter: any): Promise<number>;
}
