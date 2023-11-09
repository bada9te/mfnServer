const { validateModerateActionResolver, deleteModerateActionResolver, createModerationActionResolver } = require("../../db-reslovers/moderation-db-resolver");

module.exports = {
    Mutation: {
        createModerationAction: async(_, { input }) => {
            return await createModerationActionResolver(input);
        },
        deleteAction: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await deleteModerateActionResolver(userId, actionId, verifyToken, type);
        },
        validateAction: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await validateModerateActionResolver(userId, actionId, verifyToken, type);
        }
    }
}