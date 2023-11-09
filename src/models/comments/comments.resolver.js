const { GraphQLError } = require("graphql");
const { getManyCommentsByIdsDB, getOneCommentByIdDB, addCommentDB, removeCommentByIdDB } = require("../../db-reslovers/comments-db-resolver");

module.exports = {
    Query: {
        getManyCommentsByIds: async(_, { ids }) => {
            try {
                return await getManyCommentsByIdsDB(ids);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        getOneCommentById: async(_, { _id }) => {
            try {
                return await getOneCommentByIdDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        }
    },
    Mutation: {
        addComment: async(_, { input }) => {
            try {
                return await addCommentDB(input);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        removeById: async(_, { _id }) => {
            try {
                return await removeCommentByIdDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        }
    }
}