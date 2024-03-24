import * as playlistsModel from "../../models/playlists/playlists.model";


export default {
    Query: {
        playlistsByTitle: async(_, { title }) => {
            return await playlistsModel.getPlaylistByTitle(title);
        },
        playlistsByOwnerId: async(_, { owner, offset, limit }) => {
            return {
                playlists: await playlistsModel.getPlaylistByOwnerId(owner, { offset, limit  }),
                count: await playlistsModel.getDocsCount({ owner })
            }
        },
        playlistsPublicAvailable: async(_, { offset, limit }) => {
            return {
                playlists: await playlistsModel.getPublicAvailablePlaylists({ offset, limit }),
                count: await playlistsModel.getDocsCount({})
            }
        },
    },
    Mutation: {
        playlistCreate: async(_, { input }) => {
            let createdPlaylist;
            await playlistsModel.createPlaylist(input)
                .then(data => {
                    createdPlaylist = data[0];
                });
            
            return createdPlaylist;
        },
        playlistDeleteById: async(_, { _id }) => {
            return await playlistsModel.deletePlaylistById(_id);
        },
        playlistSwicthTrack: async(_, { input }) => {
            const { playlistId, trackId } = input;
            return await playlistsModel.swicthTrackInPlaylist(playlistId, trackId);
        },
    }
}