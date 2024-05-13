import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ],
  providers: [CommentsService]
})
export class CommentsModule {}
