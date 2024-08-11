import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Battle, BattleSchema } from './battles.schema';
import { BattlesResolver } from './battles.resolver';
import { Post } from 'src/graphql/graphql.schema';
import { PostSchema } from '../posts/posts.schema';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
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
