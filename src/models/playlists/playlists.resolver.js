const { GraphQLError } = require("graphql");
const { getPlaylistsByTitleDB, getPlaylistsByOwnerIdDB, getPublicAvailablePlaylistsDB, createPlaylistDB, deletePlaylistByIdDB, switchTrackInPlaylistDB } = require("../../db-reslovers/playlists-db-resolver")

module.exports = {
    Query: {
        getPlaylistsByTitle: async(_, { title }) => {
            try {
                return await getPlaylistsByTitleDB(title);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        getPlaylistsByOwnerId: async(_, { input }) => {
            try {
                const { ownerId, skipCount } = input;
                return await getPlaylistsByOwnerIdDB(ownerId, skipCount);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        getPublicAvailablePlaylists: async(_, { skipCount }) => {
            try {
                return await getPublicAvailablePlaylistsDB(skipCount);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
    },
    Mutation: {
        createPlaylist: async(_, { input }) => {
            try {
                return await createPlaylistDB(input);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        deletePlaylistById: async(_, { _id }) => {
            try {
                return await deletePlaylistByIdDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        switchTrackInPlaylist: async(_, { playlistId, trackId }) => {
            try {
                return await switchTrackInPlaylistDB(playlistId, trackId);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
    }
}