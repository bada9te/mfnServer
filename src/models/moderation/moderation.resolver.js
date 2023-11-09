const { GraphQLError } = require("graphql");
const { validateModerateActionDB, deleteModerateActionDB, createModerationActionDB } = require("../../db-reslovers/moderation-db-resolver");

module.exports = {
    Mutation: {
        createModerationAction: async(_, { input }) => {
            try {
                return await createModerationActionDB(input);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        deleteAction: async(_, { input }) => {
            try {
                const { userId, actionId, verifyToken, type } = input;
                return await deleteModerateActionDB(userId, actionId, verifyToken, type);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        validateAction: async(_, { input }) => {
            try {
                const { userId, actionId, verifyToken, type } = input;
                return await validateModerateActionDB(userId, actionId, verifyToken, type);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        }
    }
}