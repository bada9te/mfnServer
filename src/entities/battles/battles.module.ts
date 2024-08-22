import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Battle, BattleSchema } from './battles.schema';
import { BattlesResolver } from './battles.resolver';
import { TasksModule } from 'src/utils/tasks/tasks.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TasksModule,
    NotificationsModule,
    PostsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Battle.name,
        useFactory: () => {
          const schema = BattleSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ]),
  ],
  providers: [BattlesService, BattlesResolver],
  exports: [BattlesService],
})
export class BattlesModule {}
