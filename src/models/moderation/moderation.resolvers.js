const { validateModerateActionDB, deleteModerateActionDB, createModerationActionDB } = require("../../db-reslovers/moderation-db-resolver");
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Query: {
        moderationActionValidate: async(_, { input }) => {
            const { userId, actionId, type } = input;
            return await exec(() => validateModerateActionDB(userId, actionId, type));
        }
    },
    Mutation: {
        moderationActionCreate: async(_, { input }) => {
            return await exec(() => createModerationActionDB(input));
        },
        moderationActionDelete: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await exec(() => deleteModerateActionDB(userId, actionId, verifyToken, type));
        },
    }
}