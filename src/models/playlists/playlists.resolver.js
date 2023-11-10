const { getPlaylistsByTitleDB, getPlaylistsByOwnerIdDB, getPublicAvailablePlaylistsDB, createPlaylistDB, deletePlaylistByIdDB, switchTrackInPlaylistDB } = require("../../db-reslovers/playlists-db-resolver")
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        getPlaylistsByTitle: async(_, { title }) => {
            return await exec(() => getPlaylistsByTitleDB(title));
        },
        getPlaylistsByOwnerId: async(_, { input }) => {
            const { ownerId, skipCount } = input;
            return await exec(() => getPlaylistsByOwnerIdDB(ownerId, skipCount));
        },
        getPublicAvailablePlaylists: async(_, { skipCount }) => {
            return await exec(() => getPublicAvailablePlaylistsDB(skipCount))
        },
    },
    Mutation: {
        createPlaylist: async(_, { input }) => {
            return await exec(() => createPlaylistDB(input));
        },
        deletePlaylistById: async(_, { _id }) => {
            return await exec(() => deletePlaylistByIdDB(_id));
        },
        switchTrackInPlaylist: async(_, { input }) => {
            const { playlistId, trackId } = input;
            return await exec(() => switchTrackInPlaylistDB(playlistId, trackId));
        },
    }
}