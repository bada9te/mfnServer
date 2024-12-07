import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlaylistsService } from "./playlists.service";
import { CreatePlaylistDto, SwitchTrackDto, SwitchTracksDto } from "./dto";
import { BadRequestException, ParseIntPipe, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";
import { User, UserDocument } from "../users/users.schema";
import { CurrentUser } from "src/auth/strategy/graphql/gql.decorator";
import { Playlist } from "./playlists.schema";

@Resolver('Playlist')
export class PlaylistResolver {
    constructor(private playlistsService: PlaylistsService) {}

    private validateUserAccess(userId: string, currentUser: UserDocument) {
        if (currentUser._id.toString() !== userId.toString()) {
            throw new BadRequestException('User access violation!');
        }
    }

    @Query()
    async playlist(@Args('_id') _id: string) {
        return await this.playlistsService.getPlaylistById(_id);
    }

    @Query()
    async playlistsByTitle(@Args('title') title: string) {
        return await this.playlistsService.getPlaylistByTitle(title);
    }

    @Query()
    async playlistsByOwnerId(
        @Args('owner') owner: string,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number,
    ) {
        return {
            playlists: await this.playlistsService.getPlaylistByOwnerId(owner, {offset, limit}),
            count: await this.playlistsService.getDocsCount({ owner })
        }
    }

    @Query()
    async playlistsPublicAvailable(
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        return {
            playlists: await this.playlistsService.getPublicAvailablePlaylists({ offset, limit }),
            count: await this.playlistsService.getDocsCount({})
        }
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async playlistCreate(@Args('input') dto: CreatePlaylistDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(dto.owner, user);
        return await this.playlistsService.createPlaylist(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async playlistDeleteById(@Args('_id') _id: string, @CurrentUser() user: UserDocument) {
        const playlist = await this.playlistsService.getPlaylistById(_id);
        this.validateUserAccess(playlist.owner._id.toString(), user);
        return await this.playlistsService.deletePlaylistById(_id);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async playlistSwicthTrack(@Args('input') dto: SwitchTrackDto, @CurrentUser() user: UserDocument) {
        const playlist = await this.playlistsService.getPlaylistById(dto.playlistId);
        this.validateUserAccess(playlist.owner._id.toString(), user);
        return await this.playlistsService.swicthTrackInPlaylist(dto.playlistId, dto.trackId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async playlistsSwitchTrack(@Args('input') dto: SwitchTracksDto, @CurrentUser() user: UserDocument) {
        const playlists: Playlist[] = [];
        dto.playlistsIds.forEach(async playlistId => {
            const playlist = await this.playlistsService.getPlaylistById(playlistId);
            this.validateUserAccess(playlist.owner._id.toString(), user);
            playlists.push(await this.playlistsService.swicthTrackInPlaylist(playlistId, dto.trackId))
        });
        return playlists;
    }
}
