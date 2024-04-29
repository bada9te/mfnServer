import * as moderationModel from '../../models/moderation/moderation.model';
import generateRandomString from '../../utils/functions/generateRandomString';

export default {
    Query: {
        moderationActionValidate: async(_, { input }) => {
            const { userId, actionId, type, verifyToken } = input;
            return await moderationModel.validateAction(userId, actionId, verifyToken, type);
        }
    },
    Mutation: {
        moderationActionCreate: async(_, { input }) => {
            let createdAction;
            input.verifyToken = generateRandomString();
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