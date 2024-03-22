import mongoose from "mongoose";
import chatsModel from "./chats.mongo";
import { TNewChat } from "./types";


// create
const createChat = async(chat: TNewChat) => {
    return await chatsModel.insertMany([chat]);
}

// get by id
const getChatById = async(id: string) => {
    return await chatsModel.findById(id, {
        '__v': 0,
    });
}

// get user related
const getUserRelatedChats = async(userId: string) => {
    return await chatsModel.find(
        { 
            $or: [{ owner: userId }, { participants: userId }] 
        }
    );
}

// get many by ids
const getManyChatsByIds = async(ids: string[]) => {
    return await chatsModel.find({_id: {"$in": ids}})
        .sort({createdAt: -1});
}

// update
const updateChat = async(id, what, value) => {
    return await chatsModel.findOneAndUpdate(
        { _id: id },
        { [what]: value },
        { new: true }
    );
}

// update last message read by
const updateMessagesUnreadCount = async(chatId: string, userId: string | mongoose.Types.ObjectId, newCount: number) => {
    userId = new mongoose.Types.ObjectId(userId);
    return await chatsModel.findOneAndUpdate(
        { _id: chatId },
        [
            {
                $addFields: {
                    messagesUnreadCount: {
                        $map: {
                            input: "$messagesUnreadCount",
                            as: "mUCount",
                            in: {
                                $cond: [
                                    { $eq: ["$$mUCount.user", userId] },
                                    { user: userId, count: newCount },
                                    "$$mUCount"
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    messagesUnreadCount: {
                        $cond: [
                            { $in: [userId, "$messagesUnreadCount.user"] },
                            "$messagesUnreadCount",
                            { $concatArrays: ["$messagesUnreadCount", [{ user: userId, count: newCount }]] }
                        ]
                    }
                }
            }
        ],
        { new: true }
    );
}

// insert / remove participant
const switchParticipants = async(chatId: string, participants: string[] | mongoose.Types.ObjectId[]) => {
    participants = participants.map((i: string | mongoose.Types.ObjectId) => new mongoose.Types.ObjectId(i));
    return await chatsModel.findOneAndUpdate(
        { _id: chatId },
        [
            {
                $set: {
                    participants: {
                        $cond: [
                            { $setIsSubset: [participants, "$participants"] },
                            { $setDifference: ["$participants", participants] },
                            { $concatArrays: ["$participants", participants] }
                        ]
                    }
                }
            }
        ],
        { new: true }
    );
}


// insert / remove msg
const swicthMessage = async(chatId: string, messageId: string | mongoose.Types.ObjectId) => {
    messageId = new mongoose.Types.ObjectId(messageId);
    return await chatsModel.findOneAndUpdate(
        { _id: chatId },
        [
            { 
                $set: {
                    messages: {
                        $cond: [
                            { $in: [messageId, "$messages"] },
                            { $setDifference: ["$messages", [messageId]] },
                            { $concatArrays: ["$messages", [messageId]] }
                        ]
                    }
                } 
            }
        ],
        { new: true }
    );
}

// delete 
const deleteChatById = async(id: string) => {
    return await chatsModel.findOneAndDelete({ _id: id, });
}


export {
    createChat,
    getChatById,
    getManyChatsByIds,
    getUserRelatedChats,
    updateChat,
    updateMessagesUnreadCount,
    switchParticipants,
    swicthMessage,
    deleteChatById,
}