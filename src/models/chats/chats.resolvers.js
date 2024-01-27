const chatsModel = require("./chats.model")

module.exports = {
    Query: {
        chat: async(_, { _id }) => {
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
        chatSwicthMessage: async(_, { chatId, messageId }) => {
            return await chatsModel.swicthMessage(chatId, messageId);
        },
        chatDeleteById: async(_, { _id }) => {
            return await chatsModel.deleteChatById(_id);
        },
    },
}