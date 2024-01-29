const chatMessagesModel = require("./chat-messages.model")

module.exports = {
    Query: {
        chatMessage: async(_, { _id }) => {
            return await chatMessagesModel.getMessageById(_id);
        },
        chatMessagesByChatId: async(_, { _id: chatId, offset, limit }) => {
            return await chatMessagesModel.getMessagesByChat(chatId, { offset, limit });
        },
    },
    Mutation: {
        chatMessageCreate: async(_, { input }) => {
            let createdMsg;
            await chatMessagesModel.createMessage(input)
                .then(data => {
                    createdMsg = data[0];
                });
            return createdMsg;
        },
        chatMessageDeleteById: async(_, { _id }) => {
            return await chatMessagesModel.deleteMessageById(_id);
        },
        chatMessageUpdate: async(_, { _id, text }) => {
            return await chatMessagesModel.updateMessage(_id, text);
        },
    },
}