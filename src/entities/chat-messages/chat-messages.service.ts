import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from './chat-messages.schema';
import { Model } from 'mongoose';
import { CreateChatMessageDto } from './dto';
import { RangeDto } from 'src/common/dto';

@Injectable()
export class ChatMessagesService {
    constructor(@InjectModel(ChatMessage.name) private chatMessagesModel: Model<ChatMessage>) {}
    
    async createMessage(message: CreateChatMessageDto) {
        const inserted = await this.chatMessagesModel.insertMany(message);
        return inserted[0];
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
