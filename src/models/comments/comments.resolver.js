const { getManyCommentsByIdsDB, getOneCommentByIdDB, addCommentDB, removeCommentByIdDB } = require("../../db-reslovers/comments-db-resolver");
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        getManyCommentsByIds: async(_, { ids }) => {
            return await exec(() => getManyCommentsByIdsDB(ids));
        },
        getOneCommentById: async(_, { _id }) => {
            return await exec(() => getOneCommentByIdDB(_id));
        }
    },
    Mutation: {
        addComment: async(_, { input }) => {
            return await exec(() => addCommentDB(input));
        },
        removeCommentById: async(_, { _id }) => {
            return await exec(() => removeCommentByIdDB(_id));
        }
    }
}