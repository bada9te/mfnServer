import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './comments.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentsModel: Model<Comment>) {}
    
}
