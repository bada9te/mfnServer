const { createChat } = require("../chats/chats.model");
const { getUsersByIds } = require("../users/users.model");
const chatMessagesModel = require("./chat-messages.model");
const { withFilter, PubSub } = require("graphql-subscriptions");


const pubsub = new PubSub();

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
                .then(data => {
                    createdMsg = data[0];
                });
            pubsub.publish('CHAT-MESSAGE_CREATED', { onChatMessageCreated: args });
            return createdMsg;
        },
        chatMessageDeleteById: async(_, { _id }) => {
            return await chatMessagesModel.deleteMessageById(_id);
        },
        chatMessageUpdate: async(_, { _id, text }) => {
            return await chatMessagesModel.updateMessage(_id, text);
        },
    },
    Subscription: {
        onChatMessageCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('CHAT-MESSAGE_CREATED'),
                (payload, variables) => {
                    return (
                        variables.chatsIds.includes(payload.onChatMessageCreated.chat)
                    );
                }
            )
        }
    }
}