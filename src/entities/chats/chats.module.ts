import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chats.schema';
import { ChatsResolver } from './chats.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Chat.name,
        useFactory: () => {
          const schema = ChatSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      },
    ])
  ],
  providers: [ChatsService, ChatsResolver],
  exports: [ChatsService],
})
export class ChatsModule {}
