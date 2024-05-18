import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments.schema';
import { CommentsResolver } from './comments.resolver';
import { PostsService } from '../posts/posts.service';
import { Post, PostSchema } from '../posts/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [CommentsService, CommentsResolver, PostsService]
})
export class CommentsModule {}
