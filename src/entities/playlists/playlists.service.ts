import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from './playlists.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePlaylistDto } from './dto';
import { RangeDto } from 'src/common/dto';

@Injectable()
export class PlaylistsService {
    constructor(@InjectModel(Playlist.name) private playlistsModel: Model<Playlist>) {}

    async getPlaylistById(_id: string) {
        return await this.playlistsModel.findById(_id);
    }
    
    async createPlaylist(playlist: CreatePlaylistDto) {
        const inserted = await this.playlistsModel.insertMany([playlist]);
        return inserted[0];
    }

    async deletePlaylistById(_id: string) {
        return await this.playlistsModel.findByIdAndDelete(_id);
    }

    async swicthTrackInPlaylist(playlistId: string, trackId: string) {
        const trackIdMongo = new mongoose.Types.ObjectId(trackId);
        return await this.playlistsModel.findOneAndUpdate({ _id: playlistId }, [{
                $set: {
                    tracks: {
                        $cond: [
                            { $in: [trackIdMongo, "$tracks"] },
                            { $setDifference: ["$tracks", [trackIdMongo]] },
                            { $concatArrays: ["$tracks", [trackIdMongo]] }
                        ]
                    }
                }
            }],
            { new: true }
        )
    }

    async getPlaylistByTitle(title: string) {
        return await this.playlistsModel.find({ title: {$regex: '.*' + title + '.*'} })
            .limit(12);
    }

    async getPlaylistByOwnerId(ownerId: string, range: RangeDto) {
        return await this.playlistsModel.find({ owner: ownerId })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }

    async getPublicAvailablePlaylists(range: RangeDto) {
        return await this.playlistsModel.find({ public: true })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }
    
    async getDocsCount(filter: any) {
        return await this.playlistsModel.countDocuments(filter)
    }
}
