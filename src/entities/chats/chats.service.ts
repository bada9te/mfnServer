import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chats.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
    constructor(@InjectModel(Chat.name) private chatsModel: Model<Chat>) {}
    
}
