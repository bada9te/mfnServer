const { getManyCommentsByIdsDB, getOneCommentByIdDB, addCommentDB, removeCommentByIdDB } = require("../../db-reslovers/comments-db-resolver");
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        commentsByIds: async(_, { ids }) => {
            return await exec(() => getManyCommentsByIdsDB(ids));
        },
        comment: async(_, { _id }) => {
            return await exec(() => getOneCommentByIdDB(_id));
        }
    },
    Mutation: {
        commentCreate: async(_, { input }) => {
            return await exec(() => addCommentDB(input));
        },
        commentDeleteById: async(_, { _id }) => {
            return await exec(() => removeCommentByIdDB(_id));
        }
    }
}