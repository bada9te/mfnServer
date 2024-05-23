import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chats.schema';
import { ChatsResolver } from './chats.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
  ],
  providers: [ChatsService, ChatsResolver],
  exports: [ChatsService],
})
export class ChatsModule {}
