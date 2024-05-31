import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './chat-messages.schema';
import { ChatMessagesResolver } from './chat-messages.resolver';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { ChatsModule } from '../chats/chats.module';
import { ModerationsModule } from '../moderations/moderations.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ChatMessage.name,
        useFactory: () => {
          const schema = ChatMessageSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ]),
    ChatsModule,
    PostsModule,
    UsersModule,
    ChatsModule,
    ModerationsModule,
  ],
  providers: [ChatMessagesService, ChatMessagesResolver],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
