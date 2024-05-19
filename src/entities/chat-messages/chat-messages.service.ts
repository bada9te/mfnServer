import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from './chat-messages.schema';
import { Model } from 'mongoose';
import { CreateChatMessageDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { UsersService } from '../users/users.service';
import { ChatsService } from '../chats/chats.service';
import { ChatDocument } from '../chats/chats.schema';
import { Chat } from 'src/graphql/graphql.schema';

@Injectable()
export class ChatMessagesService {
    constructor(
        @InjectModel(ChatMessage.name) private chatMessagesModel: Model<ChatMessage>,
        private usersService: UsersService,
        private chatsService: ChatsService,
    ) {}
    
    async createMessage(message: CreateChatMessageDto) {
        let chat: ChatDocument;
        if (!message.chat) {
            const users = await this.usersService.getUsersByIds([message.owner, message.toUser]);
            const createdChat = await this.chatsService.createChat({
                title: users.map(user => user.nick).join(' '),
                owner: message.owner,
                participants: users.map(user => user._id.toString()),
            });

            message.chat = createdChat._id.toString();
            chat = await this.chatsService.getChatById(message.chat);
        } else {
            chat = await this.chatsService.getChatById(message.chat);
        }

        const inserted = await this.chatMessagesModel.insertMany([message]);
        const insertedMessage = inserted[0];

        chat.participants.forEach(async(participant) => {
            if (participant._id.toString() !== insertedMessage.owner) {
                const index = chat.messagesUnreadCount.map(i => i.user.toString()).indexOf(participant._id.toString())
                const count = chat.messagesUnreadCount[index]?.count + 1 || 0;
                await this.chatsService.updateMessagesUnreadCount(chat._id.toString(), participant._id.toString(), count);
            }
        });
        
        return insertedMessage[0];
    }

    async deleteMessageById(_id: string) {
        return await this.chatMessagesModel.findByIdAndDelete(_id);
    }

    async updateMessage(_id: string, newtext: string) {
        return await this.chatMessagesModel.findByIdAndUpdate(
            _id,
            { text: newtext },
            { new: true }
        );
    }

    async getMessageById(_id: string) {
        return await this.chatMessagesModel.findById(_id);
    }

    async getMessagesByChat(chatId: string, range: RangeDto) {
        return await this.chatMessagesModel.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(range.offset)
            .limit(range.limit);
    }
}
