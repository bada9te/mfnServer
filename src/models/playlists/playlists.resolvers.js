const { getPlaylistsByTitleDB, getPlaylistsByOwnerIdDB, getPublicAvailablePlaylistsDB, createPlaylistDB, deletePlaylistByIdDB, switchTrackInPlaylistDB } = require("../../db-reslovers/playlists-db-resolver")
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        playlistsByTitle: async(_, { title }) => {
            return await exec(() => getPlaylistsByTitleDB(title));
        },
        playlistsByOwnerId: async(_, { owner, offset, limit }) => {
            return await exec(() => getPlaylistsByOwnerIdDB(owner, { offset, limit }));
        },
        playlistsPublicAvailable: async(_, { offset, limit }) => {
            return await exec(() => getPublicAvailablePlaylistsDB({ offset, limit }))
        },
    },
    Mutation: {
        playlistCreate: async(_, { input }) => {
            return await exec(() => createPlaylistDB(input));
        },
        playlistDeleteById: async(_, { _id }) => {
            return await exec(() => deletePlaylistByIdDB(_id));
        },
        playlistSwicthTrack: async(_, { input }) => {
            const { playlistId, trackId } = input;
            return await exec(() => switchTrackInPlaylistDB(playlistId, trackId));
        },
    }
}