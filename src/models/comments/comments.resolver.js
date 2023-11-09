const { getManyCommentsByIdsDB, getOneCommentByIdDB, addCommentDB, removeCommentByIdDB } = require("../../db-reslovers/comments-db-DB");

module.exports = {
    Query: {
        getManyCommentsByIds: async(_, { ids }) => {
            return await getManyCommentsByIdsDB(ids);
        },
        getOneCommentById: async(_, { _id }) => {
            return await getOneCommentByIdDB(_id);
        }
    },
    Mutation: {
        addComment: async(_, { input }) => {
            return await addCommentDB(input);
        },
        removeById: async(_, { _id }) => {
            return await removeCommentByIdDB(_id);
        }
    }
}