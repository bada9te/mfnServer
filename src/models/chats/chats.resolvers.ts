import * as chatsModel from "./chats.model";


export default {
    Query: {
        chat: async(_, { _id, userId }) => {
            if (userId) {
                return await chatsModel.updateMessagesUnreadCount(_id, userId, 0);
            }
            return await chatsModel.getChatById(_id);
        },
        chatsByIds: async(_, { ids }) => {
            return await chatsModel.getManyChatsByIds(ids);
        },
        chatsUserRelatedByUserId: async(_, { _id: userId }) => {
            return await chatsModel.getUserRelatedChats(userId);
        },
    },
    Mutation: {
        chatCreate: async(_, { input }) => {
            let createdChat;
            await chatsModel.createChat(input)
                .then(data => {
                    createdChat = data[0];
                });
            return createdChat;
        },
        chatUpdate: async(_, { input: { _id, what, value } }) => {
            return await chatsModel.updateChat(_id, what, value);
        },
        chatReadAllMessages: async(_, { chatId, userId }) => {
            return await chatsModel.updateMessagesUnreadCount(chatId, userId, 0);
        },
        chatSwitchParticipants: async(_, { chatId, participants }) => {
            return await chatsModel.switchParticipants(chatId, participants);
        },
        chatSwitchMessage: async(_, { chatId, messageId }) => {
            return await chatsModel.swicthMessage(chatId, messageId);
        },
        chatDeleteById: async(_, { _id }) => {
            return await chatsModel.deleteChatById(_id);
        },
    },
}