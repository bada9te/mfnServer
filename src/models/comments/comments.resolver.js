const { getManyCommentsByIdsResolver, getOneCommentByIdResolver, addCommentResolver, removeCommentByIdResolver } = require("../../db-reslovers/comments-db-resolver");

module.exports = {
    Query: {
        getManyCommentsByIds: async(_, { ids }) => {
            return await getManyCommentsByIdsResolver(ids);
        },
        getOneCommentById: async(_, { _id }) => {
            return await getOneCommentByIdResolver(_id);
        }
    },
    Mutation: {
        addComment: async(_, { input }) => {
            return await addCommentResolver(input);
        },
        removeById: async(_, { _id }) => {
            return await removeCommentByIdResolver(_id);
        }
    }
}