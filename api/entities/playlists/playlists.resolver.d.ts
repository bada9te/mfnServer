import { PlaylistsService } from "./playlists.service";
import { CreatePlaylistDto, SwitchTrackDto, SwitchTracksDto } from "./dto";
import { UserDocument } from "../users/users.schema";
import { Playlist } from "./playlists.schema";
export declare class PlaylistResolver {
    private playlistsService;
    constructor(playlistsService: PlaylistsService);
    private validateUserAccess;
    playlist(_id: string): Promise<import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    playlistsByTitle(title: string): Promise<(import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    playlistsByOwnerId(owner: string, offset: number, limit: number): Promise<{
        playlists: (import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    playlistsPublicAvailable(offset: number, limit: number): Promise<{
        playlists: (import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    playlistCreate(dto: CreatePlaylistDto, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    playlistDeleteById(_id: string, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    playlistSwicthTrack(dto: SwitchTrackDto, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, Playlist> & Playlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    playlistsSwitchTrack(dto: SwitchTracksDto, user: UserDocument): Promise<Playlist[]>;
}
