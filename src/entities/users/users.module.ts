import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersResolver } from './users.resolver';
import { ModerationsService } from '../moderations/moderations.service';
import { Moderation, ModerationSchema } from '../moderations/moderations.schema';
import { EmailModule } from 'src/utils/email/email.module';
import { Post } from 'src/graphql/graphql.schema';
import { PostSchema } from '../posts/posts.schema';
import { PostsModule } from '../posts/posts.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    EmailModule,
    PostsModule,
    NotificationsModule,
    AchievementsModule,
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
  providers: [UsersService, ModerationsService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
