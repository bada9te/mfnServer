import { TRange } from "../types";
import chatMessagesModel from  "./chat-messages.mongo";
import { TNewMessage } from "./types";


// create msg
const createMessage = async(message: TNewMessage) => {
    return await chatMessagesModel.insertMany([message]);
}

// delete 
const deleteMessageById = async(id: string) => {
    return await chatMessagesModel.findOneAndDelete({ _id: id });
}

// update
const updateMessage = async(id: string, newText: string) => {
    return await chatMessagesModel.findOneAndUpdate({ _id: id }, { text: newText }, { new: true });
}

// get by id
const getMessageById = async(id: string) => {
    return await chatMessagesModel.findById(id, {
        '__v': 0
    });
}

// get chat messages 
const getMessagesByChat = async(chatId: string, range: TRange) => {
    return await chatMessagesModel.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(range.offset)
        .limit(range.limit)
}

export {
    createMessage,
    deleteMessageById,
    updateMessage,
    getMessageById,
    getMessagesByChat,
}