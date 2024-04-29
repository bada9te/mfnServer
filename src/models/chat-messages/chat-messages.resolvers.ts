import { createChat, updateChat, getChatById } from "../chats/chats.model";
import * as chatsModel from "../chats/chats.model";
import * as usersModel from "../users/users.model";
import * as chatMessagesModel from "./chat-messages.model";

export default {
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

            let chat;
            if (!input.chat) {
                const users = usersModel.getUsersByIds([input.owner, input.toUser]) as unknown as any[];
                await createChat({
                    title: users.map(user => user.nick).join(' '),
                    owner: input.owner,
                    participants: users.map(user => user._id)
                }).then(data => {
                    input.chat = data[0]._id;
                    chat = data[0];
                });
            } else {
                chat = await chatsModel.getChatById(input.chat);
            }

            let createdMsg;
            await chatMessagesModel.createMessage(input)
                .then(async data => {
                    createdMsg = data[0];
                    createdMsg.owner = await usersModel.getUserById(data[0].owner)
                });

            
            chat.participants.forEach(async(participant) => {
                if (participant._id.toString() !== createdMsg.owner._id.toString()) {
                    const index = chat.messagesUnreadCount.map(i => i.user.toString()).indexOf(participant._id.toString())
                    const count = chat.messagesUnreadCount[index]?.count + 1 || 0;
                    await chatsModel.updateMessagesUnreadCount(chat._id, participant._id, count)
                }
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