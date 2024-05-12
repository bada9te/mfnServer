import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';

@Module({
  providers: [ChatMessagesService]
})
export class ChatMessagesModule {}
