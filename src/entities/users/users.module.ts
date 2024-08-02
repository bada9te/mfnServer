import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersResolver } from './users.resolver';
import { ModerationsService } from '../moderations/moderations.service';
import { Moderation, ModerationSchema } from '../moderations/moderations.schema';
import { EmailModule } from 'src/utils/email/email.module';
import { PostsService } from '../posts/posts.service';
import { Post } from 'src/graphql/graphql.schema';
import { PostSchema } from '../posts/posts.schema';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeatureAsync([{ 
      name: User.name, 
      useFactory: () => {
        const schema = UserSchema;
        schema.plugin(require('mongoose-autopopulate'));
        return schema;
      }
    }]),
    MongooseModule.forFeature([{ 
      name: Moderation.name, schema: ModerationSchema
    }]),
    MongooseModule.forFeature([{ 
      name: Post.name, schema: PostSchema
    }]),
  ],
  providers: [UsersService, ModerationsService, UsersResolver, PostsService],
  exports: [UsersService],
})
export class UsersModule {}
