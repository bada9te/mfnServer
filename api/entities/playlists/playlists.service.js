"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const playlists_schema_1 = require("./playlists.schema");
const mongoose_2 = require("mongoose");
let PlaylistsService = class PlaylistsService {
    constructor(playlistsModel) {
        this.playlistsModel = playlistsModel;
    }
    async getPlaylistById(_id) {
        return await this.playlistsModel.findById(_id);
    }
    async createPlaylist(playlist) {
        const inserted = await this.playlistsModel.create(playlist);
        return inserted;
    }
    async deletePlaylistById(_id) {
        return await this.playlistsModel.findByIdAndDelete(_id);
    }
    async swicthTrackInPlaylist(playlistId, trackId) {
        const trackIdMongo = new mongoose_2.default.Types.ObjectId(trackId);
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
            }], { new: true });
    }
    async getPlaylistByTitle(title) {
        return await this.playlistsModel.find({ title: { $regex: '.*' + title + '.*' } })
            .limit(12);
    }
    async getPlaylistByOwnerId(ownerId, range) {
        return await this.playlistsModel.find({ owner: ownerId })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }
    async getPublicAvailablePlaylists(range) {
        return await this.playlistsModel.find({ public: true })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }
    async getDocsCount(filter) {
        return await this.playlistsModel.countDocuments(filter);
    }
};
exports.PlaylistsService = PlaylistsService;
exports.PlaylistsService = PlaylistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(playlists_schema_1.Playlist.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlaylistsService);
//# sourceMappingURL=playlists.service.js.map