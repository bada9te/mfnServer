import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chats.schema';
import mongoose, { Model } from 'mongoose';
import { CreateChatDto } from './dto';

@Injectable()
export class ChatsService {
    constructor(@InjectModel(Chat.name) private chatsModel: Model<Chat>) {}
    
    async createChat(chat: CreateChatDto) {
        const inserted = await this.chatsModel.insertMany([chat]);
        return inserted[0];
    }

    async getChatById(_id: string) {
        return await this.chatsModel.findById(_id);
    }

    async getUserRelatedChats(userId: string) {
        return await this.chatsModel.find({
            $or: [{ owner: userId }, {participants: userId}]
        })
    }

    async getManyChatsByIds(ids: string[]) {
        return await this.chatsModel.find({ _id: ids })
            .sort({ createdAt: -1 });
    }

    async updateChat(_id: string, what: string, value: string) {
        return await this.chatsModel.findByIdAndUpdate(
            _id,
            { [what]: value },
            { new: true }
        );
    }

    async updateMessagesUnreadCount(chatId: string, userId: string, newCount: number=0) {
        const userIdMongo = new mongoose.Types.ObjectId(userId);
        return await this.chatsModel.findByIdAndUpdate(
            chatId,
            [
                {
                    $addFields: {
                        messagesUnreadCount: {
                            $map: {
                                input: "$messagesUnreadCount",
                                as: "mCount",
                                in: {
                                    $cond: [
                                        { $eq: ["$$mCount.user", userIdMongo] },
                                        { user: userIdMongo, count: newCount },
                                        "$$mCount"
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
    async switchParticipants(chatId: string, participants: string[]) {
        const participantsMongo = participants.map((i: string | mongoose.Types.ObjectId) => new mongoose.Types.ObjectId(i));
        return await this.chatsModel.findOneAndUpdate(
            { _id: chatId },
            [
                {
                    $set: {
                        participants: {
                            $cond: [
                                { $setIsSubset: [participantsMongo, "$participants"] },
                                { $setDifference: ["$participants", participantsMongo] },
                                { $concatArrays: ["$participants", participantsMongo] }
                            ]
                        }
                    }
                }
            ],
            { new: true }
        );
    }


    // insert / remove msg
    async swicthMessage(chatId: string, messageId: string) {
        const messageIdMongo = new mongoose.Types.ObjectId(messageId);
        return await this.chatsModel.findOneAndUpdate(
            { _id: chatId },
            [
                { 
                    $set: {
                        messages: {
                            $cond: [
                                { $in: [messageIdMongo, "$messages"] },
                                { $setDifference: ["$messages", [messageIdMongo]] },
                                { $concatArrays: ["$messages", [messageIdMongo]] }
                            ]
                        }
                    } 
                }
            ],
            { new: true }
        );
    }

    async deleteChatById (_id: string) {
        return await this.chatsModel.findByIdAndDelete(_id);
    }
}
