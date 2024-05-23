import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './chat-messages.schema';
import { ChatMessagesResolver } from './chat-messages.resolver';
import { PostsService } from '../posts/posts.service';
import { Post, PostSchema } from '../posts/posts.schema';
import { UsersService } from '../users/users.service';
import { ChatsService } from '../chats/chats.service';
import { User, UserSchema } from '../users/users.schema';
import { Chat, ChatSchema } from '../chats/chats.schema';
import { ModerationsService } from '../moderations/moderations.service';
import { Moderation, ModerationSchema } from '../moderations/moderations.schema';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { ChatsModule } from '../chats/chats.module';
import { ModerationsModule } from '../moderations/moderations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Moderation.name, schema: ModerationSchema }]),
    PostsModule,
    UsersModule,
    ChatsModule,
    ModerationsModule,
  ],
  providers: [ChatMessagesService, ChatMessagesResolver],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
