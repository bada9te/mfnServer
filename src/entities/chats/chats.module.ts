import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
  ],
  providers: [ChatsService]
})
export class ChatsModule {}
