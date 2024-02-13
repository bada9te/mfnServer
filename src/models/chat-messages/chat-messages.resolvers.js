const { createChat, updateChat, getChatById } = require("../chats/chats.model");
const { getUsersByIds, getUserById } = require("../users/users.model");
const chatMessagesModel = require("./chat-messages.model");

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
        chatMessageCreate: async(_, args) => {
            const { input } = args;
            if (!input.chat) {
                const users = getUsersByIds([input.owner, input.toUser]);
                await createChat({
                    title: users.map(user => user.nick).join(' '),
                    owner: input.owner,
                    participants: users.map(user => user._id)
                }).then(data => {
                    input.chat = data[0]._id;
                });
            }
            let createdMsg;
            await chatMessagesModel.createMessage(input)
                .then(async data => {
                    createdMsg = data[0];
                    createdMsg.owner = await getUserById(data[0].owner)
                });

            if (input.reply) {
                createdMsg.reply = await chatMessagesModel.getMessageById(input.reply)
            }
            
            return createdMsg;
        },
        chatMessageDeleteById: async(_, { _id }) => {
            return await chatMessagesModel.deleteMessageById(_id);
        },
        chatMessageUpdate: async(_, { input: {_id, text} }) => {
            return await chatMessagesModel.updateMessage(_id, text);
        },
    },
}