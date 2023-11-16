const { validateModerateActionDB, deleteModerateActionDB, createModerationActionDB } = require("../../db-reslovers/moderation-db-resolver");
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Mutation: {
        moderationActionCreate: async(_, { input }) => {
            return await exec(() => createModerationActionDB(input));
        },
        moderationActionDelete: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await exec(() => deleteModerateActionDB(userId, actionId, verifyToken, type));
        },
        moderationActionValidate: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await exec(() => validateModerateActionDB(userId, actionId, verifyToken, type));
        }
    }
}