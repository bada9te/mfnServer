import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersResolver } from './users.resolver';
import { ModerationsService } from '../moderations/moderations.service';
import { Moderation, ModerationSchema } from '../moderations/moderations.schema';

@Module({
  imports: [
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
    }])
  ],
  providers: [UsersService, ModerationsService, UsersResolver]
})
export class UsersModule {}
