const moderationModel = require('../../models/moderation/moderation.model');

module.exports = {
    Query: {
        moderationActionValidate: async(_, { input }) => {
            const { userId, actionId, type } = input;
            await moderationModel.validateAction(userId, actionId, type);
        }
    },
    Mutation: {
        moderationActionCreate: async(_, { input }) => {
            let createdAction;
            await moderationModel.createAction(input).then(data => {
                createdAction = data[0];
            });
            return createdAction;
        },
        moderationActionDelete: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await moderationModel.deleteAction(userId, actionId, verifyToken, type);
        },
    }
}