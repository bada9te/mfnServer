import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlaylistsService } from "./playlists.service";
import { CreatePlaylistDto, SwitchTrackDto } from "./dto";
import { ParseIntPipe } from "@nestjs/common";

@Resolver('Playlist')
export class PlaylistResolver {
    constructor(private playlistsService: PlaylistsService) {}

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
    async playlistCreate(@Args('input') dto: CreatePlaylistDto) {
        return await this.playlistsService.createPlaylist(dto);
    }

    @Mutation()
    async playlistDeleteById(@Args('_id') _id: string) {
        return await this.playlistsService.deletePlaylistById(_id);
    }

    @Mutation()
    async playlistSwicthTrack(@Args('input') dto: SwitchTrackDto) {
        return await this.playlistsService.swicthTrackInPlaylist(dto.playlistId, dto.trackId);
    }
}
