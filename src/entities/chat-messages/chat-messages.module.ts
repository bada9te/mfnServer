import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './chat-messages.schema';
import { ChatMessagesResolver } from './chat-messages.resolver';
import { PostsService } from '../posts/posts.service';
import { Post, PostSchema } from '../posts/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [ChatMessagesService, ChatMessagesResolver, PostsService]
})
export class ChatMessagesModule {}
