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
exports.PlaylistResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const playlists_service_1 = require("./playlists.service");
const dto_1 = require("./dto");
const common_1 = require("@nestjs/common");
const gql_guard_1 = require("../../auth/strategy/graphql/gql.guard");
const gql_decorator_1 = require("../../auth/strategy/graphql/gql.decorator");
let PlaylistResolver = class PlaylistResolver {
    constructor(playlistsService) {
        this.playlistsService = playlistsService;
    }
    validateUserAccess(userId, currentUser) {
        if (currentUser._id.toString() !== userId.toString()) {
            throw new common_1.BadRequestException('User access violation!');
        }
    }
    async playlist(_id) {
        return await this.playlistsService.getPlaylistById(_id);
    }
    async playlistsByTitle(title) {
        return await this.playlistsService.getPlaylistByTitle(title);
    }
    async playlistsByOwnerId(owner, offset, limit) {
        return {
            playlists: await this.playlistsService.getPlaylistByOwnerId(owner, { offset, limit }),
            count: await this.playlistsService.getDocsCount({ owner })
        };
    }
    async playlistsPublicAvailable(offset, limit) {
        return {
            playlists: await this.playlistsService.getPublicAvailablePlaylists({ offset, limit }),
            count: await this.playlistsService.getDocsCount({})
        };
    }
    async playlistCreate(dto, user) {
        this.validateUserAccess(dto.owner, user);
        return await this.playlistsService.createPlaylist(dto);
    }
    async playlistDeleteById(_id, user) {
        const playlist = await this.playlistsService.getPlaylistById(_id);
        this.validateUserAccess(playlist.owner._id.toString(), user);
        return await this.playlistsService.deletePlaylistById(_id);
    }
    async playlistSwicthTrack(dto, user) {
        const playlist = await this.playlistsService.getPlaylistById(dto.playlistId);
        this.validateUserAccess(playlist.owner._id.toString(), user);
        return await this.playlistsService.swicthTrackInPlaylist(dto.playlistId, dto.trackId);
    }
    async playlistsSwitchTrack(dto, user) {
        const playlists = [];
        dto.playlistsIds.forEach(async (playlistId) => {
            const playlist = await this.playlistsService.getPlaylistById(playlistId);
            this.validateUserAccess(playlist.owner._id.toString(), user);
            playlists.push(await this.playlistsService.swicthTrackInPlaylist(playlistId, dto.trackId));
        });
        return playlists;
    }
};
exports.PlaylistResolver = PlaylistResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlist", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistsByTitle", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('owner')),
    __param(1, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistsByOwnerId", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(1, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistsPublicAvailable", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePlaylistDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistDeleteById", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SwitchTrackDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistSwicthTrack", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SwitchTracksDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistsSwitchTrack", null);
exports.PlaylistResolver = PlaylistResolver = __decorate([
    (0, graphql_1.Resolver)('Playlist'),
    __metadata("design:paramtypes", [playlists_service_1.PlaylistsService])
], PlaylistResolver);
//# sourceMappingURL=playlists.resolver.js.map