import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { PostsResolver } from './posts.resolver';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';


@Module({
  imports: [
    NotificationsModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeatureAsync([
      { 
        name: Post.name,  
        useFactory: () => {
          const schema = PostSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ]),
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
