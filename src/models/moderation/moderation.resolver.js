const { validateModerateActionDB, deleteModerateActionDB, createModerationActionDB } = require("../../db-reslovers/moderation-db-DB");

module.exports = {
    Mutation: {
        createModerationAction: async(_, { input }) => {
            return await createModerationActionDB(input);
        },
        deleteAction: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await deleteModerateActionDB(userId, actionId, verifyToken, type);
        },
        validateAction: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await validateModerateActionDB(userId, actionId, verifyToken, type);
        }
    }
}