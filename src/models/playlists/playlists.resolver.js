const { GraphQLError } = require("graphql");
const { getPlaylistsByTitleDB, getPlaylistsByOwnerIdDB, getPublicAvailablePlaylistsDB, createPlaylistDB, deletePlaylistByIdDB, switchTrackInPlaylistDB } = require("../../db-reslovers/playlists-db-resolver")
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Query: {
        getPlaylistsByTitle: async(_, args) => {
            return await exec(getPlaylistsByTitleDB, args);
        },
        getPlaylistsByOwnerId: async(_, { input }) => {
            return await exec(getPlaylistsByOwnerIdDB, input);
        },
        getPublicAvailablePlaylists: async(_, args) => {
            return await exec(getPublicAvailablePlaylistsDB, args)
        },
    },
    Mutation: {
        createPlaylist: async(_, { input }) => {
            return await exec(createPlaylistDB, input);
        },
        deletePlaylistById: async(_, { _id }) => {
            return await exec(deletePlaylistByIdDB, { id: _id })
        },
        switchTrackInPlaylist: async(_, args) => {
            return await exec(switchTrackInPlaylistDB, args);
        },
    }
}