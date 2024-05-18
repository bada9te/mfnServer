import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './chat-messages.schema';
import { ChatMessagesResolver } from './chat-messages.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }])
  ],
  providers: [ChatMessagesService, ChatMessagesResolver]
})
export class ChatMessagesModule {}
