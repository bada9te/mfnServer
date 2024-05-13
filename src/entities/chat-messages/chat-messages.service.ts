import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from './chat-messages.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatMessagesService {
    constructor(@InjectModel(ChatMessage.name) private chatMessagesModel: Model<ChatMessage>) {}
    
}
