import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments.schema';
import { CommentsResolver } from './comments.resolver';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Comment.name,
        useFactory: () => {
          const schema = CommentSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ]),
    CommentsModule,
    PostsModule,
  ],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService],
})
export class CommentsModule {}
